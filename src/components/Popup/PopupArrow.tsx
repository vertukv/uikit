import React from 'react';

import type {MiddlewareData} from '@floating-ui/react';

import {block} from '../utils/cn';

import './Popup.scss';

const b = block('popup');

interface PopupArrowProps {
    data: MiddlewareData['arrow'];
    arrowRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function PopupArrow({data, arrowRef}: PopupArrowProps) {
    const styles = React.useMemo(() => {
        if (!data) return {};

        return {
            left: typeof data.x === 'number' ? `${data.x}px` : '',
            top: typeof data.y === 'number' ? `${data.y}px` : '',
        };
    }, [data]);

    return (
        <div data-popper-arrow ref={arrowRef} className={b('arrow')} style={styles}>
            <div className={b('arrow-content')}>
                <div className={b('arrow-circle-wrapper')}>
                    <div className={b('arrow-circle', {left: true})}></div>
                </div>
                <div className={b('arrow-circle-wrapper')}>
                    <div className={b('arrow-circle', {right: true})}></div>
                </div>
            </div>
        </div>
    );
}
