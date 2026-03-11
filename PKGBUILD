# Maintainer: Peter Taraba <peter.taraba.phd@gmail.com>
pkgname=joy-browser
pkgver=0.0.12
pkgrel=1
pkgdesc="Web Browser"
arch=('any')
url="https://github.com/drpt78/joy-browser"
license=('MIT')
depends=('xdg-utils') # add real runtime deps as needed
source=("https://github.com/drpt78/joy-browser/archive/${pkgver}.tar.gz")
sha256sums=('d6151052a1ee64b72be056fb74b677fd75d3002509acb6812ec888dbbde40edc') # replace with real checksum after creating the release

build() {
  cd "${srcdir}/${pkgname}-${pkgver}"
  # If you need a build step, add it here (e.g. npm install && npm run build)
  return 0
}

package() {
  cd "${srcdir}/${pkgname}-${pkgver}"
  install -dm755 "${pkgdir}/opt/${pkgname}"
  cp -r . "${pkgdir}/opt/${pkgname}/"
  install -dm755 "${pkgdir}/usr/share/applications"
  cat > "${pkgdir}/usr/share/applications/${pkgname}.desktop" <<EOF
[Desktop Entry]
Name=Joy Browser
Exec=/opt/joy-browser/launch.sh
Icon=/opt/joy-browser/icon.png
Type=Application
Categories=Network;WebBrowser;
EOF
  # Add a simple launcher script if you need one:
  install -dm755 "${pkgdir}/opt/${pkgname}"
  cat > "${pkgdir}/opt/${pkgname}/launch.sh" <<'SH'
#!/bin/sh
exec /usr/bin/xdg-open "$@"
SH
  chmod 755 "${pkgdir}/opt/${pkgname}/launch.sh"
}
