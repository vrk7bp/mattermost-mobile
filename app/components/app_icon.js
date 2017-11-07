// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Svg, {
    G,
    Path
} from 'react-native-svg';

export default class AwayStatus extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    };

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox='75 40 525 525'
            >
                <G id='XMLID_1_' fill={this.props.color}>
                    <G id='XMLID_3_'>
                        <Path 
                            id='XMLID_4_' 
                            class='st0' 
                            d='M268 553 c-34 -21 -48 -53 -48 -108 l0 -45 -55 0 c-73 0 -95 -22 -95 -97 0 -74 28 -103 100 -103 l50 0 0 -50 c0 -41 5 -56 25 -75 13 -14 29 -25 35 -25 17 0 11 24 -10 43 -15 12 -20 29 -20 62 l0 45 55 0 c48 0 55 2 55 20 0 18 -7 20 -55 20 l-55 0 0 121 c0 133 9 166 39 147 25 -15 53 6 49 36 -4 27 -35 31 -70 9z m50 -14 c-2 -6 -8 -10 -13 -10 -5 0 -11 4 -13 10 -2 6 4 11 13 11 9 0 15 -5 13 -11z m-98 -234 l0 -65 -55 0 -55 0 0 58 c0 32 3 62 7 65 3 4 28 7 55 7 l48 0 0 -65z'
                        /> 
                        <Path 
                            id='XMLID_5_' 
                            class='st0' 
                            d='M360 536 c0 -8 7 -16 15 -20 11 -4 15 -21 15 -61 l0 -55 -50 0 c-38 0 -50 -4 -50 -15 0 -12 20 -15 120 -15 117 0 120 0 126 -23 3 -13 4 -41 2 -63 l-3 -39 -72 -3 -72 -3 -3 -72 -3 -72 -28 3 c-50 5 -77 -37 -37 -58 16 -8 28 -5 60 15 39 25 40 26 40 84 l0 59 60 4 c34 2 67 11 75 19 9 9 15 38 16 77 3 85 -13 102 -93 102 l-58 0 0 58 c0 44 -5 63 -18 75 -23 21 -42 22 -42 3z m-10 -464 c0 -13 -12 -22 -22 -16 -10 6 -1 24 13 24 5 0 9 -4 9 -8z'
                        />                        
                    </G>
                    <Path 
                        id='XMLID_2_' 
                        class='st0' 
                        d='M293 314 c-8 -21 13 -42 28 -27 13 13 5 43 -11 43 -6 0 -13 -7 -17 -16z'
                    /> 
                    <Path 
                        id='XMLID_6_' 
                        class='st0' 
                        d='M373 314 c-8 -21 13 -42 28 -27 13 13 5 43 -11 43 -6 0 -13 -7 -17 -16z'
                    /> 
                    <Path 
                        id='XMLID_7_' 
                        class='st0' 
                        d='M453 314 c-8 -20 8 -36 26 -25 15 10 8 41 -9 41 -6 0 -13 -7 -17 -16z'
                    />
                </G>
            </Svg>
        );
    }
}
