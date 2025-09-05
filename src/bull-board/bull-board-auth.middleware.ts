import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function bullBoardAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Se vier ?jwt=, setar cookie e redirecionar sem o param
  if (req.query && req.query.jwt) {
    const token = Array.isArray(req.query.jwt)
      ? req.query.jwt[0]
      : req.query.jwt;
    res.cookie('jwt', token, { httpOnly: false });
    // Remove o param jwt da URL
    const url = req.originalUrl.replace(
      /([&?])jwt=[^&]+(&|$)/,
      (match, p1, p2) => {
        if (p1 === '?') {
          if (p2) return '?';
          return '';
        }
        if (p2) return String(p1);
        return '';
      },
    );
    return res.redirect(url || '/admin/queues');
  }

  // Permitir JWT no header Authorization, cookie ou query param
  let token: string | null = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '');
  } else if (
    req.cookies &&
    typeof req.cookies === 'object' &&
    'jwt' in req.cookies
  ) {
    const jwtCookie = (req.cookies as Record<string, unknown>).jwt;
    token = typeof jwtCookie === 'string' ? jwtCookie : null;
  } else if (req.query && req.query.jwt) {
    const jwtParam = Array.isArray(req.query.jwt)
      ? req.query.jwt[0]
      : req.query.jwt;
    token = typeof jwtParam === 'string' ? jwtParam : null;
  }
  if (!token) {
    return res.status(401).json({ message: 'Token não informado' });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido');
    const payload = jwt.verify(token, secret);
    if (
      !payload ||
      typeof payload !== 'object' ||
      (payload as Record<string, unknown>).userType !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Acesso restrito a administradores' });
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
