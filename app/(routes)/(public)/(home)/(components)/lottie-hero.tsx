"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LottieHero = () => {
    return (
        <>
            {/* Animation at landing page, designed by LottieFiles. */}
            <span className="hidden"> This animation is downloaded from LottieFiles, designed by Vraj Shah.</span>
            <DotLottieReact
                src="https://lottie.host/fe9a44b5-582a-4c88-a3f4-540ff26de3b9/BSoPmqIgs1.lottie"
                loop
                autoplay
            />
        </>
    );
}

export default LottieHero;