
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import React, { useEffect, useRef } from 'react';

const CyberFiction = () => {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const locoScrollRef = useRef(null);
  const imagesRef = useRef([]);
  const imageSeqRef = useRef({ frame: 1 });

  useEffect(() => {
    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0%;
        padding: 0%;
        box-sizing: border-box;
        font-family: gilroy;
      }
      html, body {
        height: 100%;
        width: 100%;
      }
      #main {
        position: relative;
        overflow: hidden;
      }
      #page, #page1, #page2, #page3 {
        position: relative;
        height: 100vh;
        width: 100vw;
        background-color: #f1f1f1;
      }
      canvas {
        position: relative;
        z-index: 9;
        max-width: 100vw;
        max-height: 100vh;
      }
      #loop {
        display: flex;
        position: absolute;
        top: 30%;
        height: 25%;
        width: 100%;
        font-size: 100px;
        white-space: nowrap;
        font-family: gilroy;
      }
      #loop > h1 {
        font-weight: 400;
        animation-name: anim;
        animation-duration: 15s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      #loop > h1 > span {
        -webkit-text-stroke: 1.2px #000;
        color: transparent;
        font-weight: 500;
      }
      @keyframes anim {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
      #nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 8%;
        width: 100%;
        position: fixed;
        z-index: 99;
        padding: 0px 30px;
    background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border-radius: 0px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0px 0px rgba(255, 255, 255, 0);
      }
      #nav > h3 {
        font-family: gilroy;
        font-weight: 400;
        font-size: 22px;
      }
#nav > button {
  padding: 10px 20px;
  border-radius: 50px;
  background-color: #000;
  color: #fff;
  border: none;

  display: inline-flex;       /* put icon + text in a row */
  align-items: center;        /* vertical centering */
  justify-content: center;    /* horizontal centering */
  gap: 8px;                   /* space between icon and text */
}

      #page > h3 {
        position: absolute;
        margin-top: 40px;
        font-family: gilroy;
        font-weight: 400;
        color: #7c7c7c;
        left: 5%;
      }
      #page > h4 {
        position: absolute;
        margin-top: 50px;
        left: 25%;
        font-family: gilroy;
        font-weight: 500;
      }
      #page1 > #right-text {
        position: absolute;
        top: 30%;
        left: 10%;
      }
      #page1 > #right-text > h3 {
        font-weight: 400;
        color: #7c7c7c;
      }
      #page1 > #right-text > h1 {
        line-height: 1.5;
        font-size: 50px;
      }
      #page1 > #left-text {
        position: absolute;
        top: 50%;
        right: 10%;
        text-align: end;
      }
      #page1 > #left-text > h1 {
        font-size: 50px;
        line-height: 1.5;
      }
      #page1 > #left-text > h3 {
        color: #7c7c7c;
        font-weight: 400;
      }
      #page2 > #text1 {
        position: absolute;
        top: 30%;
        left: 10%;
      }
      #page2 > #text1 > h3 {
        color: #7c7c7c;
        font-weight: 400;
      }
      #page2 > #text1 > h1 {
        font-size: 60px;
        line-height: 1.5;
      }
      #page2 > #text2 {
        position: absolute;
        top: 55%;
        right: 10%;
        text-align: end;
      }
      #page2 > #text2 > p {
        color: #7c7c7c;
        font-weight: 400;
      }
      #page3 > #text3 {
        position: absolute;
        top: 40%;
        right: 10%;
        text-align: end;
      }
      #page3 > #text3 > h3 {
        color: #7c7c7c;
        font-weight: 400;
      }
      #page3 > #text3 > h1 {
        font-size: 70px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Dynamically load required scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initializeApp = async () => {
      try {
        // Load Locomotive Scroll CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.css';
        document.head.appendChild(link);

        // Load scripts in order
        await loadScript('https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js');

        // Initialize after scripts load
        initLocoScroll();
        initCanvas();
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    const initLocoScroll = () => {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      const LocomotiveScroll = window.LocomotiveScroll;
      locoScrollRef.current = new LocomotiveScroll({
        el: mainRef.current,
        smooth: true,
      });

      locoScrollRef.current.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(mainRef.current, {
        scrollTop(value) {
          return arguments.length
            ? locoScrollRef.current.scrollTo(value, 0, 0)
            : locoScrollRef.current.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: mainRef.current.style.transform ? 'transform' : 'fixed',
      });

      ScrollTrigger.addEventListener('refresh', () => locoScrollRef.current.update());
      ScrollTrigger.refresh();
    };

    const files = (index) => {
      // Generate placeholder images for demonstration
      // Replace these URLs with your actual image paths
      const data = Array.from({ length: 300 }, (_, i) =>
        `./male${String(i + 1).padStart(4, '0')}.png`
      );
      return data[index];
    };

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      const { gsap, ScrollTrigger } = window;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      };

      window.addEventListener('resize', handleResize);

      const frameCount = 300;
      const images = [];
      const loadedImages = new Set();

      // Create a fallback canvas for when images don't load
      const createFallbackImage = () => {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 800;
        fallbackCanvas.height = 600;
        const fallbackCtx = fallbackCanvas.getContext('2d');

        // Create gradient background
        const gradient = fallbackCtx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        fallbackCtx.fillStyle = gradient;
        fallbackCtx.fillRect(0, 0, 800, 600);

        // Add text
        fallbackCtx.fillStyle = '#ffffff';
        fallbackCtx.font = 'bold 48px Arial';
        fallbackCtx.textAlign = 'center';
        fallbackCtx.fillText('CYBERFICTION', 400, 280);
        fallbackCtx.font = '24px Arial';
        fallbackCtx.fillText('Image sequence loading...', 400, 340);

        const img = new Image();
        img.src = fallbackCanvas.toDataURL();
        return img;
      };

      const fallbackImg = createFallbackImage();

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          loadedImages.add(i);
        };

        img.onerror = () => {
          // Use fallback image on error
          images[i] = fallbackImg;
        };

        img.src = files(i);
        images.push(img);
      }

      imagesRef.current = images;

      const scaleImage = (img, ctx) => {
        if (!img || !img.complete || img.naturalWidth === 0) {
          // Use fallback if image is not ready
          img = fallbackImg;
        }

        try {
          const canvas = ctx.canvas;
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.max(hRatio, vRatio);
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
          );
        } catch (error) {
          // Silently fail and clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      const render = () => {
        const currentImg = imagesRef.current[imageSeqRef.current.frame];
        if (currentImg) {
          scaleImage(currentImg, context);
        }
      };

      gsap.to(imageSeqRef.current, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          scrub: 0.5,
          trigger: canvasRef.current,
          start: 'top top',
          end: '600% top',
          scroller: mainRef.current,
        },
        onUpdate: render,
      });

      images[1].onload = render;

      ScrollTrigger.create({
        trigger: canvasRef.current,
        pin: true,
        scroller: mainRef.current,
        start: 'top top',
        end: '600% top',
        pinSpacing: false,
      });

      // Pin other pages with adjusted settings
      gsap.to('#page1', {
        scrollTrigger: {
          trigger: '#page1',
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scroller: mainRef.current,
          pinSpacing: false,
        },
      });

      gsap.to('#page2', {
        scrollTrigger: {
          trigger: '#page2',
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scroller: mainRef.current,
          pinSpacing: false,
        },
      });

      gsap.to('#page3', {
        scrollTrigger: {
          trigger: '#page3',
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scroller: mainRef.current,
          pinSpacing: false,
        },
      });

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    initializeApp();

    return () => {
      if (locoScrollRef.current) {
        locoScrollRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div id="nav">
        <h3>
          <b>MELT</b>CHOCOLATE
        </h3>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="#ffffffff" stroke-linecap="round" stroke-linejoin="round"
            id="Calendar--Streamline-Lucide" height="20" width="20">
            <desc>Calendar Streamline Icon</desc>
            <path d="M8 2v4" stroke-width="2"></path>
            <path d="M16 2v4" stroke-width="2"></path>
            <path d="M5 4h14s2 0 2 2v14s0 2 -2 2H5s-2 0 -2 -2V6s0 -2 2 -2" stroke-width="2"></path>
            <path d="M3 10h18" stroke-width="2"></path>
          </svg>
          <span>December, 2025</span>
        </button>

      </div>
      <div id="main" ref={mainRef}>
        <div id="page">
          <div id="loop">
            <h1>
              <b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN THE{' '}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1>
              <b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN THE{' '}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1>
              <b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN THE{' '}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
          </div>
          <h3>
            CYBERFICTION AIMS TO BE A DECENTRALIZED COMMUNITY THAT CAN <br /> CREATE NEW VALUES
            AND PROFITS THROUGH PLAY IN THE VIRTUAL <br /> WORLD.
          </h3>
          <h4>...SCROLL TO READ</h4>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div id="page1">
          <div id="right-text">
            <h3>CYBERFICTION / KEY WORD</h3>
            <h1>
              HAVE FUN
              <br />
              LET'S PLAY
              <br />
              JUST BE TOGETHER
            </h1>
          </div>
          <div id="left-text">
            <h1>
              MAKE A STORY
              <br />
              TAKE A CHANCE
              <br />
              BUILD AND OWNED
            </h1>
            <h3>..AND MAINTAIN GOOD HUMANITY</h3>
          </div>
        </div>
        <div id="page2">
          <div id="text1">
            <h3>CYBERFICTION / HAVE FUN</h3>
            <h1>
              LET'S
              <br />
              HAVE FUN
              <br />
              TOGETHER
            </h1>
          </div>
          <div id="text2">
            <p>
              LET'S HAVE A BLAST! LET'S JUST THROW AWAY AGE, GENDER, REGION, <br /> STATUS, ETC.,
              DON'T COMPETE, DON'T FIGHT, COOPERATE AND SHARE <br /> WITH EACH OTHER AND ENJOY IT
              TOGETHER! SO THAT YOU CAN STAND <br /> THERE IN THE NOT-TOO-DISTANT FUTURE AND DREAM
              OF ANOTHER NEW <br /> FUTURE
            </p>
          </div>
        </div>
        <div id="page3">
          <div id="text3">
            <h3>CYBERFICTION / PLAYGROUND</h3>
            <h1>
              CYBERFIELD
              <br />
              IS OUR
              <br />
              PLAYGROUND
            </h1>
          </div>
        </div>
        <div id="page2">
          <div id="text1">
            <h3>CYBERFICTION / HAVE FUN</h3>
            <h1>
              LET'S
              <br />
              HAVE FUN
              <br />
              TOGETHER
            </h1>
          </div>
          <div id="text2">
            <p>
              LET'S HAVE A BLAST! LET'S JUST THROW AWAY AGE, GENDER, REGION, <br /> STATUS, ETC.,
              DON'T COMPETE, DON'T FIGHT, COOPERATE AND SHARE <br /> WITH EACH OTHER AND ENJOY IT
              TOGETHER! SO THAT YOU CAN STAND <br /> THERE IN THE NOT-TOO-DISTANT FUTURE AND DREAM
              OF ANOTHER NEW <br /> FUTURE
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CyberFiction;
