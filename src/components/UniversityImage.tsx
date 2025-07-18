import { Rect, Txt, RectProps } from '@motion-canvas/2d/lib/components';

export const UniversityImage = (props: RectProps) => {
  return (
    <Rect 
      fill={'#2E7D32'} 
      width={800} 
      height={600} 
      radius={10}
      {...props}
    >
      <Txt 
        fill={'white'} 
        fontSize={48} 
        fontWeight={600}
        text="🎓 UNIVERSITY"
      />
    </Rect>
  );
};
