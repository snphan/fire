import React, { useState } from 'react';

function Carousel(props: any) {
  console.log(props.children)

  const itemCnt = props.children.length;
  const [itemIndex, setItemIndex] = useState<number>(0);

  const goForward = () => {
    if (itemIndex === itemCnt - 1) {
      setItemIndex(0);
      return;
    }
    setItemIndex(itemIndex + 1);
  }

  const goBackward = () => {
    if (itemIndex === 0) {
      setItemIndex(itemCnt - 1);
      return;
    }
    setItemIndex(itemIndex - 1);
  }

  return (
    <div className={(props.className ? props.className : "") + " relative"}>
      <div className="mx-2 cursor-pointer absolute top-1/2 -translate-y-1/2 left-2" onClick={goBackward}>
        <span className="material-icons hover:scale-110 drop-shadow-strong">arrow_back_ios</span>
      </div>
      {props.children ?
        <>
          {props.children[itemIndex]}
        </>
        :
        <span className="text-5xl material-icons text-gray-600">photo_camera</span>
      }
      <div className="mx-2 cursor-pointer absolute top-1/2 -translate-y-1/2 right-2" onClick={goForward}>
        <span className="material-icons hover:scale-110 drop-shadow-strong">arrow_forward_ios</span>
      </div>
      <div className="flex absolute bottom-5 right-1/2 translate-x-1/2">
        {
          ([...Array(itemCnt).keys()]).map((item) => {
            return (
              <div className={((item === itemIndex) ? "bg-gray-300" : "bg-gray-700") + " w-2 h-2 mx-1 rounded-full drop-shadow-strong"}></div>
            )
          })
        }
      </div>
    </div>
  )
}

function CarouselItem(props: any) {
  return (
    <div className='flex h-full rounded-xl justify-center items-center overflow-hidden'>
      {props.children}
      {props.imgSrc &&
        <img className="max-w-lg h-full w-full rounded-xl object-cover" src={props.imgSrc} alt="" />
      }
    </div>
  )
}

export default Object.assign(Carousel, {
  Item: CarouselItem
})