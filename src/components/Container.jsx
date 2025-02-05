function Container (props){
    return(
        <div className={`DivBody ${props.customClass}`}>{props.children}</div>
    )
}

export default Container;