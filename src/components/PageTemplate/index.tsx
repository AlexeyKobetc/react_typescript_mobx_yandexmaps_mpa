import React, { Children, cloneElement, ComponentType, isValidElement, ReactNode } from "react";

const PageTemplate = ({ children }: { children?: ReactNode | ComponentType }) => (
  <div className="container-fluid p-0 m-0">
    {Children.map(children, child => {
      if (isValidElement(child)) {
        return <div className="container-fluid">{cloneElement(child)}</div>;
      }
    })}
  </div>
);

export default PageTemplate;
