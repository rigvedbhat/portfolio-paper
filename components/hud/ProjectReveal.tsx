"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project, RepoMeta } from '@/lib/types';
import { fetchRepoMeta, fetchRecentCommits, type CommitSummary } from '@/lib/github-api';

interface ProjectRevealProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (slug: string | null) => void;
  visible: boolean;
}

export default function ProjectReveal({
  projects,
  selectedProject,
  onSelectProject,
  visible
}: ProjectRevealProps) {
  const [repoData, setRepoData] = useState<RepoMeta | null>(null);
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const selected = projects.find(p => p.slug === selectedProject);

  useEffect(() => {
    if (selected) {
      setLoading(true);
      Promise.all([
        fetchRepoMeta(selected.owner, selected.repo),
        fetchRecentCommits(selected.owner, selected.repo)
      ]).then(([meta, recentCommits]) => {
        setRepoData(meta);
        setCommits(recentCommits || []);
        setLoading(false);
      });
    }
  }, [selected]);

  return (
    <div className={`content-panel hud-interactive ${visible ? 'open' : ''}`}>
      <div className="ink-edge"></div>
      
      {!selectedProject ? (
        <div className="project-list">
          <h2 className="panel-title fade-up">Projects</h2>
          <div className="panel-subtitle fade-up delay-1">The Living Archive</div>
          
          <div style={{ marginTop: '2rem' }}>
            {projects.map((project, idx) => (
              <motion.div
                key={project.slug}
                className="project-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                onClick={() => onSelectProject(project.slug)}
              >
                <div className="project-card-theme">{project.theme}</div>
                <div className="project-card-title">{project.title}</div>
                <div className="panel-body" style={{ marginBottom: 0 }}>{project.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className="brush-btn" style={{ marginBottom: '2rem' }} onClick={() => onSelectProject(null)}>
            ← Back to List
          </button>
          
          <h2 className="panel-title fade-up">{selected?.title}</h2>
          <div className="panel-subtitle fade-up delay-1">{selected?.theme}</div>
          
          <div className="panel-quote fade-up delay-2">&ldquo;{selected?.quote}&rdquo;</div>
          
          <div className="panel-body fade-up delay-3">
            {selected?.subtitle}
          </div>
          
          {loading ? (
            <div style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Loading repository data...
            </div>
          ) : (
            repoData && (
              <div className="fade-up delay-4" style={{ marginTop: '2rem', borderTop: '1px solid rgba(245,240,232,0.1)', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '1rem' }}>
                  Repository
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  <span>★ {repoData.stars} Stars</span>
                  {repoData.language && <span>◆ {repoData.language}</span>}
                </div>
                
                {commits.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>
                      Recent Activity
                    </h3>
                    {commits.slice(0, 3).map((commit) => (
                      <div key={commit.sha} style={{ 
                        fontSize: '0.85rem', opacity: 0.7, 
                        borderLeft: '1px solid rgba(245,240,232,0.2)', paddingLeft: '1rem' 
                      }}>
                        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '0.25rem', color: 'var(--color-amber)' }}>
                          {commit.sha} · {new Date(commit.date).toLocaleDateString()}
                        </div>
                        <div>{commit.message}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <a 
                  href={`https://github.com/${selected?.owner}/${selected?.repo}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="brush-btn" 
                  style={{ display: 'inline-block', marginTop: '2rem' }}
                >
                  View on GitHub
                </a>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
