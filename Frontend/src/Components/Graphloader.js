import React from "react"
import ContentLoader from "react-content-loader"

const Graphloader = (props) => (
  <ContentLoader 
    speed={2}
    width={1000}
    height={300}
    viewBox="0 0 1000 300"
    backgroundColor="#c7c7c7"
    foregroundColor="#dbdbdb"
    {...props}
  >
    <rect x="0" y="60" rx="2" ry="2" width="3000" height="600" />
  </ContentLoader>
)

export default Graphloader

