import React from 'react';

// import {FloatingFocusManager} from '@floating-ui/react';

import {Side, UseTransitionStylesProps, useTransitionStyles} from '@floating-ui/react';

import {Portal} from '../Portal';
import type {DOMProps, QAProps} from '../types';
// import {useParentFocusTrap} from '../utils/FocusTrap';
import {block} from '../utils/cn';
// import {getCSSTransitionClassNames} from '../utils/transition';
// import {useForkRef} from '../utils/useForkRef';
import {useLayer} from '../utils/useLayer';
import type {LayerExtendableProps} from '../utils/useLayer';
import {PopperArrowRef, usePopper} from '../utils/usePopper';
import type {PopperAnchorRef, PopperPlacement, PopperProps} from '../utils/usePopper';
import {useRestoreFocus} from '../utils/useRestoreFocus';

import {PopupArrow} from './PopupArrow';

import './Popup.scss';
export type PopupPlacement = PopperPlacement;
export type PopupAnchorRef = PopperAnchorRef;

export interface PopupProps extends DOMProps, LayerExtendableProps, PopperProps, QAProps {
    open: boolean;
    children?: React.ReactNode;
    keepMounted?: boolean;
    hasArrow?: boolean;
    disableLayer?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    disablePortal?: boolean;
    container?: HTMLElement;
    contentClassName?: string;
    restoreFocus?: boolean;
    restoreFocusRef?: React.RefObject<HTMLElement>;
    role?: React.AriaRole;
    id?: string;
}

const b = block('popup');
// const ARROW_SIZE = 8;

type PopupTranslateOptions = Record<
    Side,
    Record<keyof Pick<UseTransitionStylesProps, 'initial' | 'open'>, string>
>;

const TRANSITION_DISTANCE = '10px';

const TRANSLATE_OPTIONS: PopupTranslateOptions = {
    bottom: {
        initial: `translateY(0)`,
        open: `translateY(${TRANSITION_DISTANCE})`,
    },
    top: {
        initial: `translateY(${TRANSITION_DISTANCE})`,
        open: `translateY(${TRANSITION_DISTANCE})`,
    },
    right: {
        initial: `translateY(${TRANSITION_DISTANCE})`,
        open: `translateY(${TRANSITION_DISTANCE})`,
    },
    left: {
        initial: `translateY(${TRANSITION_DISTANCE})`,
        open: `translateY(${TRANSITION_DISTANCE})`,
    },
};

export function Popup({
    // keepMounted = false,
    hasArrow = false,
    // offset = [0, 4],
    offsetOptions = {},
    open,
    placement,
    anchorRef,
    disableEscapeKeyDown,
    disableOutsideClick,
    disableLayer,
    style,
    className,
    contentClassName,
    middleware = [],
    children,
    onEscapeKeyDown,
    onOutsideClick,
    onClose,
    onClick,
    onMouseEnter,
    onMouseLeave,
    disablePortal,
    container,
    strategy,
    qa,
    restoreFocus,
    restoreFocusRef,
    role,
    id,
}: PopupProps) {
    const [arrowRef, setArrowRef] = React.useState<PopperArrowRef>(null);

    const {
        refs,
        context,
        interactions,
        placement: popperPlacement,
    } = usePopper({
        anchorRef,
        arrowRef,
        open,
        placement,
        offsetOptions,
        strategy,
        middleware,
    });

    const {isMounted, styles} = useTransitionStyles(context, {
        duration: 100,
        initial: ({side}) => ({
            transform: TRANSLATE_OPTIONS[side].initial,
            opacity: 0,
        }),
        open: ({side}) => ({
            transform: TRANSLATE_OPTIONS[side].open,
            opacity: 1,
        }),
        close: ({side}) => ({
            transform: TRANSLATE_OPTIONS[side].initial,
            opacity: 0,
        }),
    });

    useLayer({
        open: isMounted,
        disableEscapeKeyDown,
        disableOutsideClick,
        onEscapeKeyDown,
        onOutsideClick,
        onClose,
        contentRefs: [refs.reference, refs.floating],
        enabled: !disableLayer,
    });

    // const handleRef = useForkRef<HTMLDivElement>(refs.setFloating, useParentFocusTrap());

    const containerProps = useRestoreFocus({
        enabled: Boolean(restoreFocus && isMounted),
        restoreFocusRef,
    });

    return (
        <Portal container={container} disablePortal={disablePortal}>
            {/* <FloatingFocusManager context={context} modal={false}> */}
            {/* mounted by default, because it was managed by csstransition */}
            {isMounted && (
                <div
                    ref={refs.setFloating}
                    style={context.floatingStyles}
                    // {...attributes.popper}
                    className={b(null, className)}
                    data-placement={popperPlacement}
                    tabIndex={-1}
                    data-qa={qa}
                    id={id}
                    role={role}
                    {...containerProps}
                    {...interactions.getFloatingProps()}
                >
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div
                        onClick={onClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        className={b('content', contentClassName)}
                        style={{...styles, ...style}}
                    >
                        {hasArrow && (
                            <PopupArrow
                                // styles={styles.arrow}
                                // attributes={attributes.arrow}
                                setArrowRef={setArrowRef}
                            />
                        )}
                        {children}
                    </div>
                </div>
            )}

            {/* </FloatingFocusManager> */}
        </Portal>
    );
}
