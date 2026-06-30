# syntax=docker/dockerfile:1.7
# =============================================================================
# Nexus Ecosystem — Static Site Container
# -----------------------------------------------------------------------------
# Vanilla HTML / CSS / JS application served by nginx on port 3000.
# Build:  docker build -t nexus-ecosystem .
# Run:    docker run --rm -p 3000:3000 --name nexus nexus-ecosystem
# Visit:  http://localhost:3000
# =============================================================================

FROM nginx:1.27-alpine

# Drop the stock nginx site config and install ours (listens on 3000,
# enables gzip, sets sensible cache headers, supports clean folder URLs).
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entire static site into nginx's web root. The build context is
# trimmed by .dockerignore so only HTML/CSS/JS/assets ship.
WORKDIR /usr/share/nginx/html
COPY . .

# Run as the non-root nginx user; bind to an unprivileged port.
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx
USER nginx

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
