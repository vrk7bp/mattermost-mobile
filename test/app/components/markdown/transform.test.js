// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import assert from 'assert';
import {Parser} from 'commonmark';

import {
    astToJson,
    astToString,
    makeAst,
    pullOutImages,
    verifyAst
} from 'app/components/markdown/transform';

describe('Components.Markdown.transform', () => {
    const parser = new Parser();

    describe('pullOutImages', () => {
        // it('simple example with no images', () => {
        //     const input = 'test';
        //     const ast = parser.parse(input);

        //     assert.deepStrictEqual(pullOutImages(ast), parser.parse(input));
        // });

        // it('complex example with no images', () => {
        //     const input = '- abc\n    1. def\n\n    2. ghi\n\n3. jkl\n- mno\n    1. pqr\n---\n# vwx\n\nyz';
        //     const ast = parser.parse(input);

        //     assert.deepStrictEqual(pullOutImages(ast), parser.parse(input));
        // });

        it('paragraph', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'paragraph',
                    children: [{
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image'
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'paragraph',
                    children: []
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }]
            });
            const actual = pullOutImages(input);

            console.log('actual');
            console.log(astToString(actual));

            console.log('expected');
            console.log(astToString(expected));

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it.only('paragraph with surrounding text', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'paragraph',
                    children: [{
                        type: 'text',
                        literal: 'This is text with '
                    }, {
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image'
                        }]
                    }, {
                        type: 'text',
                        literal: ' in it'
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'paragraph',
                    children: [{
                        type: 'text',
                        literal: 'This is text with '
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'paragraph',
                    continue: true,
                    children: [{
                        type: 'text',
                        literal: ' in it'
                    }]
                }]
            });
            const actual = pullOutImages(input);

            console.log('actual');
            console.log(astToString(actual));

            console.log('expected');
            console.log(astToString(expected));

            console.log('text is equal? ' + (astToString(actual) === astToString(expected)));

            console.log('--------------actual\n' + astToJson(actual) + '\n-----------expected\n' + astToJson(expected));

            assert.ok(verifyAst(actual));
            assert.deepEqual(actual, expected);
        });

        // it('paragraph with multiple images', () => {
        //     const input = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'paragraph',
        //             children: [{
        //                 type: 'image',
        //                 src: 'http://example.com/image',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'an image'
        //                 }]
        //             }, {
        //                 type: 'image',
        //                 src: 'http://example.com/image2',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'another image'
        //                 }
        //             }]
        //         }]
        //     });
        //     const expected = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'paragraph',
        //             children: []
        //         }, {
        //             type: 'image',
        //             src: 'http://example.com/image',
        //             children: [{
        //                 type: 'text',
        //                 literal: 'an image'
        //             }]
        //         }, {
        //             type: 'paragraph',
        //             continue: true,
        //             children: []
        //         }, {
        //             type: 'image',
        //             src: 'http://example.com/image2',
        //             children: [{
        //                 type: 'text',
        //                 literal: 'another image'
        //             }]
        //         }, {
        //             type: 'paragraph',
        //             continue: true,
        //             children: []
        //         }]
        //     });

        //     assert.deepStrictEqual(pullOutImages(input), expected);
        // });

        // it('block quote', () => {
        //     const input = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: [{
        //                     type: 'image',
        //                     src: 'http://example.com/image',
        //                     children: [{
        //                         type: 'text',
        //                         literal: 'an image'
        //                     }]
        //                 }]
        //             }]
        //         }]
        //     });
        //     const expected = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: []
        //             },{
        //                 type: 'image',
        //                 src: 'http://example.com/image',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'an image'
        //                 }]
        //             }, {
        //                 type: 'paragraph',
        //                 continue: true,
        //                 children: []
        //             }]
        //         }]
        //     });

        //     assert.deepStrictEqual(pullOutImages(input), expected);
        // });

        // it('block quote with other text', () => {
        //     const input = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'This is '
        //                 }, {
        //                     type: 'image',
        //                     src: 'http://example.com/image',
        //                     children: [{
        //                         type: 'text',
        //                         literal: 'an image'
        //                     }]
        //                 }, {
        //                     type: 'text',
        //                     literal: ' in a sentence'
        //                 }]
        //             }]
        //         }]
        //     });
        //     const expected = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'This is '
        //                 }]
        //             },{
        //                 type: 'image',
        //                 src: 'http://example.com/image',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'an image'
        //                 }]
        //             }, {
        //                 type: 'paragraph',
        //                 continue: true,
        //                 children: [{
        //                     type: 'text',
        //                     literal: ' in a sentence'
        //                 }]
        //             }]
        //         }]
        //     });

        //     assert.deepStrictEqual(pullOutImages(input), expected);
        // });

        // it('unordered list', () => {
        //     const input = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'This is '
        //                 }, {
        //                     type: 'image',
        //                     src: 'http://example.com/image',
        //                     children: [{
        //                         type: 'text',
        //                         literal: 'an image'
        //                     }]
        //                 }, {
        //                     type: 'text',
        //                     literal: ' in a sentence'
        //                 }]
        //             }]
        //         }]
        //     });
        //     const expected = makeAst({
        //         type: 'document',
        //         children: [{
        //             type: 'block_quote',
        //             children: [{
        //                 type: 'paragraph',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'This is '
        //                 }]
        //             },{
        //                 type: 'image',
        //                 src: 'http://example.com/image',
        //                 children: [{
        //                     type: 'text',
        //                     literal: 'an image'
        //                 }]
        //             }, {
        //                 type: 'paragraph',
        //                 continue: true,
        //                 children: [{
        //                     type: 'text',
        //                     literal: ' in a sentence'
        //                 }]
        //             }]
        //         }]
        //     });

        //     assert.deepStrictEqual(pullOutImages(input), expected);
        // });
    });
});
