

const LoadMoreBtn = ({result, page, Load, handleLoadMore}) => {
    return (
        <>
        
            {
              

                !Load && <button className="btn btn-dark mx-auto d-block"
                onClick={handleLoadMore}>
                    Load more
                </button>
            }
            
        </>
    )
}
export default LoadMoreBtn