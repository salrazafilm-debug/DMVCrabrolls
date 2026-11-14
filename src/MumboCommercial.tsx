import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import './style.css';

const source = staticFile('mumbo-original.mp4');
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const SourceFootage: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#171313'}}>
    <OffthreadVideo src={source} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </AbsoluteFill>
);

const Typography: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const scale = width / 2560;
  const headlineIn = interpolate(frame, [35, 47], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const headlineOut = interpolate(frame, [78, 88], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const headlineProgress = Math.min(headlineIn, headlineOut);
  // The closing lockup waits for the source camera to finish pulling back, keeping the bottle clear.
  const taglineIn = interpolate(frame, [91, 104], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{pointerEvents: 'none', width: 2560, height: 1440, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
      <div className="headline-wrap" style={{opacity: headlineProgress, clipPath: `inset(0 ${100 - headlineIn * 100}% 0 0)`, transform: `translateY(${(1 - headlineIn) * 26}px)`, filter: `blur(${(1 - headlineIn) * 3}px)`}}>
        <div className="eyebrow">WORLD’S BEST</div>
        <div className="headline">MUMBO SAUCE</div>
        <div className="accent" />
      </div>
      <div className="tagline-wrap" style={{opacity: taglineIn, transform: `translateX(${(1 - taglineIn) * -22}px)`, filter: `blur(${(1 - taglineIn) * 2}px)`}}>
        <div className="tagline-rule" />
        <div className="tagline">ONLY HERE AT<br />DMV CRABROLLS</div>
      </div>
    </AbsoluteFill>
  );
};

export const MumboCommercial: React.FC = () => <AbsoluteFill><SourceFootage /><Typography /></AbsoluteFill>;
export const MumboClean: React.FC = () => <SourceFootage />;
