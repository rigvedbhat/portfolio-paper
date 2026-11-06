export function SketchFilters() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute top-0 left-0 pointer-events-none opacity-0 -z-50"
      aria-hidden="true"
    >
      <defs>
        {/* Primary hand-drawn wobble filter */}
        <filter id="sketch-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015"
            numOctaves="2"
            seed="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="4.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Subtle sketch filter for small text / buttons */}
        <filter id="sketch-subtle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="2"
            seed="3"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
