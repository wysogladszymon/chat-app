import { FC, useEffect, useRef } from 'react';

interface PicturePreviewProps {
  photoURL: string;
  onClick: ()=> void;
}

export const PicturePreview: FC<PicturePreviewProps> = ({ photoURL, onClick }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);
  return <div className='z-50 absolute h-[100%] w-[100vw] bg-gray-950 pt-5 pb-20 '>
    <button onClick={onClick} className='mt-5 ml-5 w-16 h-16  flex group flex-col relative'>
      <div className='w-full bg-gray-200 h-2 absolute group top-1/2 -translate-y-1/2 -rotate-45 rounded-lg group-hover:bg-gray-400 group-hover:-translate-y-2 transition-all duration-300'/>
      <div className='w-full bg-gray-200 h-2 absolute group top-1/2 -translate-y-1/2 rotate-45 rounded-lg group-hover:bg-gray-400 group-hover:-translate-y-2 transition-all duration-300'/>
    </button>
    <img src={photoURL} alt="" className='max-w-full max-h-full w-auto h-auto block m-auto fit rounded-xl' style={{objectFit: 'cover'}} />
    <div ref={bottomRef} className='h-1 w-1 absolute bottom-0'/>
  </div>;
};
