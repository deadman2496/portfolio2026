export function MobileNavAnimations() {
  return (
    <style>
      {`
        @keyframes mobileMenuHintFade {
          0% {
            opacity: 0;
            transform: translateX(0.5rem);
          }

          12% {
            opacity: 1;
            transform: translateX(0);
          }

          78% {
            opacity: 1;
            transform: translateX(0);
          }

          100% {
            opacity: 0;
            transform: translateX(0.5rem);
          }
        }

        @keyframes mobileNavRipple {
          0% {
            opacity: 0.55;
            transform: scale(0.86);
          }

          70% {
            opacity: 0.14;
          }

          100% {
            opacity: 0;
            transform: scale(1.65);
          }
        }
      `}
    </style>
  );
}