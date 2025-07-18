import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import { MEME_STYLE } from './MemeStyle';

// PLACEHOLDER: Using automation meme as temporary placeholder
// TODO: Save the distracted boyfriend meme image as 'distracted-boyfriend-meme.jpg' in the images folder
// The actual file should be: ../images/distracted-boyfriend-meme.jpg
import distractedBoyfriendMeme from './media/distracted_boyfriend_meme.png';

export class DistractedBoyfriendMeme extends Img {
  constructor(props: ImgProps = {}) {
    super({
      src: distractedBoyfriendMeme,
      ...MEME_STYLE,
      ...props,
    });
  }
}
