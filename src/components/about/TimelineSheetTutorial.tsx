export default function TimelineSheetTutorial() {
  return (
    <>
      <style>
        {`
          @keyframes timelineSheetTutorialFade {
            0% {
              opacity: 0;
              transform: translateY(-0.35rem);
            }

            12% {
              opacity: 1;
              transform: translateY(0);
            }

            78% {
              opacity: 1;
              transform: translateY(0);
            }

            100% {
              opacity: 0;
              transform: translateY(-0.35rem);
            }
          }
        `}
      </style>

      <div className="pointer-events-none px-4 pb-2 sm:px-5">
        <div
          className="rounded-2xl border border-blue-300/15 bg-blue-300/10 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-blue-100/80 shadow-xl backdrop-blur-xl"
          style={{
            animation: "timelineSheetTutorialFade 6s ease-out forwards",
          }}
        >
          Swipe left or right to switch experiences. Drag the top line down or
          double tap it to close.
        </div>
      </div>
    </>
  );
}