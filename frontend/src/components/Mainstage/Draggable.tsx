import React, { useRef, useLayoutEffect } from 'react';
import Matter from 'matter-js';

const { Engine, Render, Composite, Bodies, Mouse, MouseConstraint } = Matter;

export default function Draggable() {
  interface CustomBodyRenderOptions extends Matter.IBodyRenderOptions {
    text?: string;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const words = [
    'Dad',
    'Husband',
    'Software Engineer',
    'Backend Developer',
    'FullStack Developer',
    'Most Likely Has ADHD',
    'Christian',
  ];

  useLayoutEffect(() => {
    console.log('Canvas element:', canvasRef.current);
    if (!containerRef.current || !canvasRef.current) {
      console.error('Error! containerRef or canvasRef not detected');
      return;
    }

    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 1, // Downward gravity
        scale: 0.001, // Default scale, adjust if too slow
      },
    });
    engineRef.current = engine;

    const canvasWidth = containerRef.current.clientWidth;
    const canvasHeight = containerRef.current.clientHeight;
    const wallThickness = 100;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        showInternalEdges: true,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;
    
    // Create walls aligned with canvas edges
    const walls = [
      // Ground (bottom)
      Bodies.rectangle(
        canvasWidth / 2,
        canvasHeight + wallThickness / 2,
        canvasWidth + wallThickness,
        wallThickness,
        {
          isStatic: true,
          render: { fillStyle: 'green' },
        }
      ),
      // Roof (top)
      Bodies.rectangle(
        canvasWidth / 2,
        -wallThickness /2,
        canvasWidth + wallThickness,
        wallThickness,
        {
          isStatic: true,
          render: { fillStyle: 'yellow' },
        }
      ),
      // Left wall
      Bodies.rectangle(
        -wallThickness / 2,
        canvasHeight / 2,
        wallThickness,
        canvasHeight,
        {
          isStatic: true,
          render: { fillStyle: 'blue' },
        }
      ),
      // Right wall
      Bodies.rectangle(
        canvasWidth + wallThickness /2,
        canvasHeight / 2,
        wallThickness,
        canvasHeight,
        {
          isStatic: true,
          render: { fillStyle: 'red' },
        }
      ),
    ];

    // Create word bodies within bounds
    const wordBodies = words.map((word) => { //add index if you using calculations. Right now it just centers the bodies
      const width = word.length * 10 + 20;
      const height = 40;
      const x = canvasWidth / 2; //Math.max(width / 2 + 10, Math.min(150 + index * 175, canvasWidth - width / 2 - 10))
      const y = 0; //Math.max(height / 2 + 10, Math.min(50 + index * 50, canvasHeight - height / 2 - 10))
      return Bodies.rectangle(x, y, width, height, {
        restitution: 0.6,
        friction: 0.1,
        render: {
          fillStyle: '#00ff99',
          text: word,
        } as CustomBodyRenderOptions,
      });
    });

    Composite.add(engine.world, [...walls, ...wordBodies]);
    console.log('Bodies added:', engine.world.bodies);

    const mouse = Mouse.create(render.canvas);
    console.log('Mouse created with canvas:', render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    console.log('MouseConstraint:', mouseConstraint);

    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      wordBodies.forEach((body) => {
        const { position } = body;
        const bodyRender = body.render as CustomBodyRenderOptions;
        if (bodyRender.text) {
          context.save();
          context.translate(position.x, position.y);
          context.rotate(body.angle);
          context.font = '18px Arial';
          context.fillStyle = '#000000';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(bodyRender.text, 0, 0);
          context.restore();
        }
      });
    });

    //Move objects back onto canvas if they are outside it's bounds
    Matter.Events.on(engine, 'beforeUpdate', () => {
      wordBodies.forEach((body) => {
        if (body.position.x < wallThickness) //Left Wall Check
          Matter.Body.setPosition(body, {x: wallThickness, y: body.position.y})
        if (body.position.x > canvasWidth + wallThickness) //Right Wall check
          Matter.Body.setPosition(body, {x: canvasWidth - wallThickness, y: body.position.y})
        if (body.position.y > canvasHeight + wallThickness) //Ground Check
          Matter.Body.setPosition(body, {x: body.position.x, y: canvasHeight - wallThickness})
        if (body.position.y < 0) //Roof Check
          Matter.Body.setPosition(body, {x: body.position.x, y: wallThickness})
      })
    })

    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner,engine);


    return () => {
      Render.stop(render);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fidget-container"
      style={{ height: '55vh', width: '100%', position: 'relative' }}
    >
      <canvas
        className='draggable'
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      ></canvas>
    </div>
  );
}