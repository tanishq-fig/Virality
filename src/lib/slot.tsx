import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;
    
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...slotProps,
        ...children.props,
        ref: forwardedRef,
      } as any);
    }
    
    return React.Children.count(children) > 1 ? (
      React.Children.only(null)
    ) : null;
  }
);

Slot.displayName = "Slot";
