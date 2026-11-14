import React from 'react';
import {Composition} from 'remotion';
import {MumboCommercial, MumboClean} from './MumboCommercial';

const FPS = 24;
const DURATION = 5 * FPS;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MumboCommercial" component={MumboCommercial} durationInFrames={DURATION} fps={FPS} width={2560} height={1440} />
    <Composition id="MumboClean" component={MumboClean} durationInFrames={DURATION} fps={FPS} width={2560} height={1440} />
    <Composition id="MumboPreview" component={MumboCommercial} durationInFrames={DURATION} fps={FPS} width={1280} height={720} />
  </>
);
