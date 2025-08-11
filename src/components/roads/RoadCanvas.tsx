import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Road, Milestone } from '../../lib/types';

interface RoadCanvasProps {
  road: Road;
  milestones: Milestone[];
  onMilestoneClick: (milestone: Milestone) => void;
}

export function RoadCanvas({ road, milestones, onMilestoneClick }: RoadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Theme configurations with new background images
    const themes = {
      futuristic: {
        background: 'https://raw.githubusercontent.com/MagicStudioAI/road-journey/main/journey1.jpg',
        roadColor: '#4F46E5',
        glowColor: '#818CF8',
        milestoneColors: {
          incomplete: '#6B7280',
          complete: '#10B981',
          active: '#4F46E5'
        }
      },
      nature: {
        background: 'https://raw.githubusercontent.com/MagicStudioAI/road-journey/main/journey2.jpg',
        roadColor: '#059669',
        glowColor: '#34D399',
        milestoneColors: {
          incomplete: '#6B7280',
          complete: '#10B981',
          active: '#059669'
        }
      },
      minimalistic: {
        background: 'https://raw.githubusercontent.com/MagicStudioAI/road-journey/main/journey3.jpg',
        roadColor: '#4B5563',
        glowColor: '#9CA3AF',
        milestoneColors: {
          incomplete: '#6B7280',
          complete: '#10B981',
          active: '#4B5563'
        }
      }
    };

    const theme = themes[road.theme];

    // Load background image
    const backgroundImage = new Image();
    backgroundImage.src = theme.background;
    backgroundImage.onload = () => {
      // Animation variables
      let animationFrame: number;
      let offset = 0;
      let particles: Array<{
        x: number;
        y: number;
        speed: number;
        size: number;
        alpha: number;
      }> = [];

      // Create particles
      const createParticles = () => {
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2 + 1,
            size: Math.random() * 3 + 1,
            alpha: Math.random() * 0.5 + 0.5
          });
        }
      };

      createParticles();

      const drawBackground = () => {
        // Draw background image
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Draw overlay gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      const drawParticles = () => {
        ctx.save();
        particles.forEach((particle, index) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
          ctx.fill();

          // Update particle position
          particle.y -= particle.speed;
          particle.x += Math.sin(offset * 0.02 + index) * 0.5;

          // Reset particle if it goes off screen
          if (particle.y < 0) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
          }
        });
        ctx.restore();
      };

      const drawRoad = () => {
        const roadWidth = 40;
        const curveAmplitude = 50;
        const curveFrequency = 0.002;

        ctx.save();
        // Draw road glow
        ctx.shadowColor = theme.glowColor;
        ctx.shadowBlur = 20;
        ctx.lineWidth = roadWidth;
        ctx.strokeStyle = theme.roadColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Create curved road path
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x <= canvas.width; x += 10) {
          const progress = x / canvas.width;
          const y = canvas.height / 2 + 
                    Math.sin((x + offset) * curveFrequency) * curveAmplitude * 
                    Math.sin(progress * Math.PI);
          ctx.lineTo(x, y);
        }

        ctx.stroke();

        // Draw progress overlay
        const progress = road.progress / 100;
        ctx.clip();
        const progressGradient = ctx.createLinearGradient(0, 0, canvas.width * progress, 0);
        progressGradient.addColorStop(0, theme.glowColor);
        progressGradient.addColorStop(1, theme.roadColor);
        ctx.fillStyle = progressGradient;
        ctx.fillRect(0, 0, canvas.width * progress, canvas.height);

        ctx.restore();
      };

      const drawMilestones = () => {
        const activeIndex = milestones.findIndex(m => !m.is_completed);

        milestones.forEach((milestone, index) => {
          const progress = (index + 1) / (milestones.length + 1);
          const x = canvas.width * progress;
          const y = canvas.height / 2 + 
                    Math.sin((x + offset) * 0.002) * 50 * 
                    Math.sin(progress * Math.PI);

          // Draw milestone connection line
          ctx.beginPath();
          ctx.moveTo(x, y - 30);
          ctx.lineTo(x, y + 30);
          ctx.strokeStyle = milestone.is_completed ? 
            theme.milestoneColors.complete : 
            theme.milestoneColors.incomplete;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw milestone marker
          ctx.save();
          ctx.shadowColor = milestone.is_completed ? 
            theme.milestoneColors.complete : 
            index === activeIndex ?
            theme.milestoneColors.active :
            theme.milestoneColors.incomplete;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = milestone.is_completed ? 
            theme.milestoneColors.complete : 
            index === activeIndex ?
            theme.milestoneColors.active :
            theme.milestoneColors.incomplete;
          ctx.fill();
          ctx.restore();

          // Draw milestone label
          ctx.save();
          ctx.font = '12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(milestone.title, x, y + 40);

          if (milestone.is_completed) {
            ctx.fillStyle = '#10B981';
            ctx.fillText(`+${milestone.xp_reward} XP`, x, y + 55);
          }
          ctx.restore();

          // Draw completion indicator
          if (milestone.is_completed) {
            ctx.save();
            ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('✓', x, y + 4);
            ctx.restore();
          }
        });
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBackground();
        drawParticles();
        drawRoad();
        drawMilestones();
        
        offset += 1;
        animationFrame = requestAnimationFrame(animate);
      };

      animate();

      // Handle milestone clicks
      const handleClick = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        milestones.forEach((milestone, index) => {
          const progress = (index + 1) / (milestones.length + 1);
          const milestoneX = canvas.width * progress;
          const milestoneY = canvas.height / 2 + 
                          Math.sin((milestoneX + offset) * 0.002) * 50 * 
                          Math.sin(progress * Math.PI);

          const distance = Math.sqrt(
            Math.pow(x - milestoneX, 2) + Math.pow(y - milestoneY, 2)
          );

          if (distance < 15) {
            onMilestoneClick(milestone);
          }
        });
      };

      canvas.addEventListener('click', handleClick);

      return () => {
        cancelAnimationFrame(animationFrame);
        canvas.removeEventListener('click', handleClick);
      };
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [road, milestones, onMilestoneClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden rounded-lg bg-white shadow-lg"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{road.title}</h3>
            <p className="text-sm text-gray-500">{road.description}</p>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1">
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(road.progress)}% Complete
            </span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="h-96 w-full cursor-pointer rounded-lg"
          style={{ touchAction: 'none' }}
        />
      </div>
    </motion.div>
  );
}