import React, { useEffect, useRef } from 'react'
import gsap from "gsap";
import { Draggable, InertiaPlugin, } from "gsap/all";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function Fidget() {
    const containerRef = useRef<HTMLDivElement>(null);
    const words = ["Software Engineer", "Backend Developer", "FullStack Developer", "Husband", "Dad", "Christian", "ADHD Most Likely"];
    const wordRefs = useRef<(HTMLDivElement | null)[]>([]);

    const velocities = useRef<{ x: number, y: number }[]>(words.map(() => ({ x:0, y:0 })))
    useEffect(() => {
    if (!containerRef.current) return;
    
    const gravity = 0.5;
    const bounceFactor = 0.6;
    const friction = 0.98;

    const updatePhysics = () => {
        wordRefs.current.forEach((wordEl, index) => {
            if (!wordEl || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const wordRect = wordEl.getBoundingClientRect();

            velocities.current[index].y += gravity;
            
            //Calculations for positions taking bounds into consideration
            let newX = wordRect.left - containerRect.left + velocities.current[index].x;
            let newY = wordRect.top - containerRect.top + velocities.current[index].y;
            
            //Bottom Collision
            if (newY + wordRect.height >= containerRect.height) {
                newY = containerRect.height - wordRect.height;
                velocities.current[index].y *= -bounceFactor; //Negative bounce factor to give bounce affect
            }

            //Top Collision
            if (newY < 0) {
                newY = 0;
                velocities.current[index].y *= -bounceFactor;
            }

            //Left Collision
            if (newX < 0) {
                newX = 0;
                velocities.current[index].x *= -bounceFactor;
            }

            //Right Collision
            if (newX + wordRect.width >= containerRect.width) {
                newX = containerRect.width - wordRect.width;
                velocities.current[index].x *= -bounceFactor;
            }

            //Applying friction to movements
            velocities.current[index].x *= friction;

            gsap.set(wordEl, { x: newX, y: newY });
        });

        requestAnimationFrame(updatePhysics);
    };

    // Start physics loop
    const animationFrame = requestAnimationFrame(updatePhysics);

    //Loop through the wordsRefs to create draggable
    wordRefs.current.forEach((wordEl, index) => {
        if (!wordEl || !containerRef.current) return

        Draggable.create(wordEl, {
            bounds: containerRef.current,
            inertia: {
                x: {
                    velocity: 0,
                },
                y: {
                    velocity: 0,
                }
            },
            onClick: function () {
                console.log(`${words[index]} clicked`);
            },
            onDragStart: function () {
                //While dragging pause the physics
                velocities.current[index].x = 0;
                velocities.current[index].y = 0;
            },
            onDragEnd: function () {
                if (this.inertia) {
                    velocities.current[index].x = this.inertia.x.velocity / 60;
                    velocities.current[index].y = this.inertia.y.velocity / 60;
                }
            },
            
        });
        
    });

    return () => {
        cancelAnimationFrame(animationFrame);
    }

    }, []);
    return (
        <div ref={containerRef} className="fidget-container" style={{ height: '100%', width: '100%' }}>
            {words.map((word, index) => (
                <div 
                    key={word}
                    ref={(el) => { wordRefs.current[index] = el }}
                    className='word'
                    style={{
                        position: "absolute",
                        top: `${10 + index * 10}%`, // Stagger initial positions 10 + index * 10
                        left: `${10 + index * 10}%`,
                        padding: "10px 20px",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "grab",
                        userSelect: "none",
                    }}
                >
                    {word}
                </div>
            ))}
        </div>
    )
}
