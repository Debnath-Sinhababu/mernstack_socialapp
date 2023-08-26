import React from "react";

const Carousel = ({ id, images }) => {
    console.log(images)
    const isActive = index => {
        if(index === 0) return "active";
    }

  return (
  
    <div id={`carouselExampleIndicators${id}`} class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      {

images.length > 1 && images.map((img, index) => (
          <li
            key={index}
            data-target={`#carouselExampleIndicators${id}`}
            data-slide-to={index}
            className={isActive(index)}
            style={{filter:'invert(1)'}}
            />
        ))
      }
      
    </ol>
    <div class="carousel-inner">
    {images.map((img, index) => (
          <div key={index} className={`carousel-item  ${isActive(index)}`}>
            {
              img.type=='image'?<img
              src={img.url}
              className="d-block w-100"
             
              style={{ filter:"invert(0)" }}
            />: <video
            src={img.url}
            className="d-block w-100"
          
            controls
            
            style={{ filter:"invert(0)",objectPosition:'center',objectFit:'contain' }}
          />
            }
            
          </div>
        ))}
    </div>
    {
      images.length > 1 && <>
      
      <a class="carousel-control-prev" href={`#carouselExampleIndicators${id}`} role="button" data-slide="prev"
     style={{ width: "5%" ,filter:'invert(1)'}}
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href={`#carouselExampleIndicators${id}`} role="button" data-slide="next"
      style={{ width: "5%" ,filter:'invert(1)'}}
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
      </>
    }
   
  </div>
  );
};

export default Carousel;
