type TextOverlayProps = {
  topText: string;
  bottomText?: string;
};

const memeShadow =
  "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 8px rgba(0,0,0,.45)";

export function TextOverlay({ topText, bottomText }: TextOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 md:p-5">
      <p
        className="text-center text-3xl font-extrabold uppercase leading-tight text-white md:text-5xl"
        style={{ textShadow: memeShadow }}
      >
        {topText}
      </p>
      {bottomText ? (
        <p
          className="text-center text-xl font-bold uppercase leading-tight text-white md:text-3xl"
          style={{ textShadow: memeShadow }}
        >
          {bottomText}
        </p>
      ) : null}
    </div>
  );
}
