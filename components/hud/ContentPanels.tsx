"use client";

import React, { useState } from 'react';
import type { DestinationId, JourneyStage } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentPanelsProps {
  activeDestination: DestinationId;
  journeyStages: JourneyStage[];
  contactInfo: { email: string; github: string; linkedin: string; githubHandle: string };
}

export default function ContentPanels({ activeDestination, journeyStages, contactInfo }: ContentPanelsProps) {
  const [activeStageIdx, setActiveStageIdx] = useState<number | null>(null);

  const isResearch = activeDestination === 'research';
  const isJourney = activeDestination === 'journey';
  const isContact = activeDestination === 'contact';

  return (
    <>
      {/* Research Panel */}
      <div className={`content-panel hud-interactive ${isResearch ? 'open' : ''}`}>
        <div className="ink-edge"></div>
        <h2 className="panel-title">Research</h2>
        <div className="panel-subtitle">Academic Pursuits</div>
        
        <div className="panel-quote">
          &ldquo;Research begins where intuition is no longer enough.&rdquo;
        </div>
        
        <div className="panel-body">
          <p style={{ marginBottom: '1rem' }}>
            My path was never a straight line. Code pulled me toward systems. Design taught me restraint. 
            AI made me ask sharper questions about where automation actually belongs.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            That is what brought me into sustainable tourism research: models for visitor-flow redistribution 
            that combine machine learning with behavioral economics. I am interested in systems that can be 
            technically rigorous and still feel thoughtful in the real world.
          </p>
          <p>
            The goal is not to make technology louder. It is to make complex things more usable, 
            more legible, and more human.
          </p>
        </div>
        
        <a href="https://github.com/rigvedbhat/tourism-ai-dss" target="_blank" rel="noreferrer" className="brush-btn" style={{ display: 'inline-block' }}>
          View Repository
        </a>
      </div>

      {/* Journey Panel */}
      <div className={`content-panel hud-interactive ${isJourney ? 'open' : ''}`}>
        <div className="ink-edge"></div>
        <h2 className="panel-title">Journey</h2>
        <div className="panel-subtitle">Path of the Builder</div>
        
        <div className="journey-path">
          {journeyStages.map((stage, idx) => (
            <div 
              key={stage.rank} 
              className={`journey-stone ${activeStageIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveStageIdx(activeStageIdx === idx ? null : idx)}
            >
              <div className="journey-year">{stage.duration}</div>
              <div className="journey-role">{stage.rank}</div>
              <div className="journey-org">{stage.organization}</div>
              
              <AnimatePresence>
                {activeStageIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="panel-body" style={{ marginTop: '0.5rem', marginBottom: 0, paddingBottom: '1rem', fontSize: '0.85rem' }}>
                      <p style={{ marginBottom: '0.75rem' }}>{stage.story}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {stage.technologies.map((tech) => (
                          <span key={tech} style={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '0.25rem 0.5rem',
                            border: '1px solid rgba(245, 240, 232, 0.15)',
                            opacity: 0.6,
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Panel */}
      <div className={`content-panel hud-interactive ${isContact ? 'open' : ''}`}>
        <div className="ink-edge"></div>
        <h2 className="panel-title">Contact</h2>
        <div className="panel-subtitle">Send a Signal</div>
        
        <div className="panel-quote">
          &ldquo;If the work resonates, let us make the next thing matter.&rdquo;
        </div>
        
        <div className="panel-body">
          I am open to product work, research collaborations, and difficult problems that need 
          both technical depth and clear design.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          <a href={`mailto:${contactInfo.email}`} style={{ color: 'var(--color-cream)', textDecoration: 'none', transition: 'opacity 0.3s' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.25rem' }}>Email</span>
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>{contactInfo.email}</span>
          </a>
          
          <a href={contactInfo.github} target="_blank" rel="noreferrer" style={{ color: 'var(--color-cream)', textDecoration: 'none', transition: 'opacity 0.3s' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.25rem' }}>GitHub</span>
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>@{contactInfo.githubHandle}</span>
          </a>
          
          <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--color-cream)', textDecoration: 'none', transition: 'opacity 0.3s' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.25rem' }}>LinkedIn</span>
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>Rigved Bhat</span>
          </a>
        </div>
      </div>
    </>
  );
}
