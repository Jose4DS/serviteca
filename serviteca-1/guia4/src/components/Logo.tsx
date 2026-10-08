/**
 * Logo de la Serviteca.
 * Si existe un archivo /public/logo.png lo muestra; si no, muestra un
 * espacio reservado con el nombre del negocio.
 */
export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <div
      className="flex items-center gap-3 select-none"
      aria-label="Logo Serviteca ADSO"
    >
      {/* Ícono SVG de llave inglesa como logo provisional */}
      <div
        style={{ width: size, height: size }}
        className="rounded-full flex items-center justify-center flex-shrink-0"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="32" fill="#4a7c59" />
          {/* Llave inglesa */}
          <g transform="translate(12, 12)">
            <path
              d="M32 8C25.4 8 20 13.4 20 20c0 3 1.1 5.7 2.9 7.8L6 44.7 9.3 48l16.9-16.9C28.3 32.9 31 34 34 34c5.5 0 10-4.5 10-10 0-1-.1-2-.4-3l-6.6 6.6-4-4 6.6-6.6C38.6 17 37.4 16.4 36 16c-1.1-.3-2.3-.5-3.5-.5L32 8zm0 4c.7 0 1.4.1 2 .3L28 18.3c-.6 1.4-.6 3 0 4.4l3.3 3.3c1.4.6 3 .6 4.4 0l6-6c.2.6.3 1.3.3 2 0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6z"
              fill="white"
            />
          </g>
          {/* Gota de aceite */}
          <ellipse cx="44" cy="44" rx="6" ry="8" fill="#8B4513" opacity="0.85" />
          <ellipse cx="44" cy="43" rx="4" ry="5" fill="#A0522D" opacity="0.7" />
        </svg>
      </div>
      <div className="leading-tight">
        <div
          className="font-bold text-white"
          style={{ fontFamily: 'Times New Roman, serif', fontSize: size * 0.3 }}
        >
          Serviteca
        </div>
        <div
          className="text-green-200"
          style={{ fontFamily: 'Times New Roman, serif', fontSize: size * 0.2 }}
        >
          ADSO
        </div>
      </div>
    </div>
  );
}
