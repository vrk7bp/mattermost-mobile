// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import assert from 'assert';
import {Parser, XmlRenderer} from 'commonmark';
import fs from 'fs'

import {
    addListItemIndices,
    astToJson,
    astToString,
    makeAst,
    pullOutImages,
    verifyAst
} from 'app/components/markdown/transform';

describe('Components.Markdown.transform', () => {
    const parser = new Parser();

    describe('addListItemIndices', () => {
        it('unordered list', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    children: [{
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const actual = addListItemIndices(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('ordered list', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    listStart: 7,
                    listDelimiter: 'period',
                    children: [{
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    listStart: 7,
                    listDelimiter: 'period',
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const actual = addListItemIndices(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('nested lists', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    listStart: 7,
                    listDelimiter: 'period',
                    children: [{
                        type: 'item',
                        children: [{
                            type: 'list',
                            listType: 'bullet',
                            listTight: true,
                            listStart: 3,
                            listDelimiter: 'period',
                            children: [{
                                type: 'item',
                                children: [{
                                    type: 'pargraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'one'
                                    }]
                                }]
                            }, {
                                type: 'item',
                                children: [{
                                    type: 'list',
                                    listTight: true,
                                    children: [{
                                        type: 'item',
                                        children: [{
                                            type: 'pargraph',
                                            children: [{
                                                type: 'text',
                                                literal: 'one'
                                            }]
                                        }]
                                    }, {
                                        type: 'item',
                                        children: [{
                                            type: 'pargraph',
                                            children: [{
                                                type: 'text',
                                                literal: 'two'
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }, {
                    type: 'list',
                    listTight: true,
                    children: [{
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    listStart: 7,
                    listDelimiter: 'period',
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'list',
                            listType: 'bullet',
                            listTight: true,
                            listStart: 3,
                            listDelimiter: 'period',
                            children: [{
                                type: 'item',
                                index: 3,
                                children: [{
                                    type: 'pargraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'one'
                                    }]
                                }]
                            }, {
                                type: 'item',
                                index: 4,
                                children: [{
                                    type: 'list',
                                    listTight: true,
                                    children: [{
                                        type: 'item',
                                        index: 1,
                                        children: [{
                                            type: 'pargraph',
                                            children: [{
                                                type: 'text',
                                                literal: 'one'
                                            }]
                                        }]
                                    }, {
                                        type: 'item',
                                        index: 2,
                                        children: [{
                                            type: 'pargraph',
                                            children: [{
                                                type: 'text',
                                                literal: 'two'
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }, {
                    type: 'list',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'one'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
                        children: [{
                            type: 'pargraph',
                            children: [{
                                type: 'text',
                                literal: 'two'
                            }]
                        }]
                    }]
                }]
            });
            const actual = addListItemIndices(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });
    });

    describe('pullOutImages', () => {
        it('simple example with no images', () => {
            const input = parser.parse('test');
            const expected = parser.parse('test');
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('complex example with no images', () => {
            const inputString = '- abc\n    1. def\n\n    2. ghi\n\n3. jkl\n- mno\n    1. pqr\n---\n# vwx\n\nyz';
            const input = parser.parse(inputString);
            const expected = parser.parse(inputString);
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

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

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('paragraph with surrounding text', () => {
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

            assert.ok(verifyAst(actual));
            assert.deepEqual(actual, expected);
        });

        it('paragraph with multiple images', () => {
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
                    }, {
                        type: 'image',
                        src: 'http://example.com/image2',
                        children: [{
                            type: 'text',
                            literal: 'another image'
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
                }, {
                    type: 'paragraph',
                    continue: true,
                    children: []
                }, {
                    type: 'image',
                    src: 'http://example.com/image2',
                    children: [{
                        type: 'text',
                        literal: 'another image'
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('headings', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'heading',
                    level: 1,
                    children: [{
                        type: 'text',
                        literal: 'This is the start 1'
                    }, {
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image 1'
                        }]
                    }]
                }, {
                    type: 'heading',
                    level: 4,
                    children: [{
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image 2'
                        }]
                    }, {
                        type: 'text',
                        literal: 'This is the end 2'
                    }]
                }, {
                    type: 'heading',
                    level: 2,
                    children: [{
                        type: 'text',
                        literal: 'This is the start 3'
                    }, {
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image 3'
                        }]
                    }, {
                        type: 'text',
                        literal: 'This is the end 3'
                    }]
                }, {
                    type: 'heading',
                    level: 3,
                    children: [{
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image 4a'
                        }]
                    }, {
                        type: 'image',
                        src: 'http://example.com/image',
                        children: [{
                            type: 'text',
                            literal: 'an image 4b'
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'heading',
                    level: 1,
                    children: [{
                        type: 'text',
                        literal: 'This is the start 1'
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image 1'
                    }]
                }, {
                    type: 'heading',
                    level: 4,
                    children: []
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image 2'
                    }]
                }, {
                    type: 'heading',
                    level: 4,
                    continue: true,
                    children: [{
                        type: 'text',
                        literal: 'This is the end 2'
                    }]
                }, {
                    type: 'heading',
                    level: 2,
                    children: [{
                        type: 'text',
                        literal: 'This is the start 3'
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image 3'
                    }]
                }, {
                    type: 'heading',
                    level: 2,
                    continue: true,
                    children: [{
                        type: 'text',
                        literal: 'This is the end 3'
                    }]
                }, {
                    type: 'heading',
                    level: 3,
                    children: []
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image 4a'
                    }]
                }, {
                    type: 'heading',
                    level: 3,
                    continue: true,
                    children: [],
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image 4b'
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('block quote', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'block_quote',
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
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'block_quote',
                    children: [{
                        type: 'paragraph',
                        children: []
                    }]
                },{
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('block quote with other text', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'block_quote',
                    children: [{
                        type: 'paragraph',
                        children: [{
                            type: 'text',
                            literal: 'This is '
                        }, {
                            type: 'image',
                            src: 'http://example.com/image',
                            children: [{
                                type: 'text',
                                literal: 'an image'
                            }]
                        }, {
                            type: 'text',
                            literal: ' in a sentence'
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'block_quote',
                    children: [{
                        type: 'paragraph',
                        children: [{
                            type: 'text',
                            literal: 'This is '
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'block_quote',
                    continue: true,
                    children: [{
                        type: 'paragraph',
                        continue: true,
                        children: [{
                            type: 'text',
                            literal: ' in a sentence'
                        }]
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('unordered list', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
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
                    }, {
                        type: 'item',
                        index: 3,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is moretext'
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
                        children: [{
                            type: 'paragraph',
                            children: []
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'bullet',
                    listTight: true,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 3,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is moretext'
                            }]
                        }]
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('ordered list', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
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
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
                        children: [{
                            type: 'paragraph',
                            children: []
                        }]
                    }]
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

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('complicated list', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }, {
                                type: 'image',
                                src: 'http://example.com/image',
                                children: [{
                                    type: 'text',
                                    literal: 'an image'
                                }]
                            }, {
                                type: 'image',
                                src: 'http://example.com/image',
                                children: [{
                                    type: 'text',
                                    literal: 'an image'
                                }]
                            }, {
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 9,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }, {
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 10,
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
                    }, {
                        type: 'item',
                        index: 11,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    children: [{
                        type: 'item',
                        index: 7,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 8,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 8,
                        continue: true,
                        children: [{
                            type: 'paragraph',
                            continue: true
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 8,
                        continue: true,
                        children: [{
                            type: 'paragraph',
                            continue: true,
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 9,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }, {
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 10,
                        children: [{
                            type: 'paragraph',
                            children: []
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: false,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 11,
                        children: [{
                            type: 'paragraph',
                            children: [{
                                type: 'text',
                                literal: 'This is text'
                            }]
                        }]
                    }]
                }]
            });
            const actual = pullOutImages(input);

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        it('nested lists', () => {
            const input = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'list',
                            listType: 'bulleted',
                            listTight: false,
                            children: [{
                                type: 'item',
                                index: 3,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }, {
                                        type: 'image',
                                        src: 'http://example.com/image',
                                        children: [{
                                            type: 'text',
                                            literal: 'an image'
                                        }]
                                    }]
                                }]
                            }, {
                                type: 'item',
                                index: 4,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'image',
                                        src: 'http://example.com/image',
                                        children: [{
                                            type: 'text',
                                            literal: 'an image'
                                        }]
                                    }, {
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
                        children: [{
                            type: 'list',
                            listType: 'ordered',
                            listTight: true,
                            children: [{
                                type: 'item',
                                index: 1,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'image',
                                        src: 'http://example.com/image',
                                        children: [{
                                            type: 'text',
                                            literal: 'an image'
                                        }]
                                    }, {
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }, {
                                type: 'item',
                                index: 2,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }, {
                                        type: 'image',
                                        src: 'http://example.com/image',
                                        children: [{
                                            type: 'text',
                                            literal: 'an image'
                                        }]
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            });
            const expected = makeAst({
                type: 'document',
                children: [{
                    type: 'list',
                    listType: 'ordered',
                    listTight: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        children: [{
                            type: 'list',
                            listType: 'bulleted',
                            listTight: false,
                            children: [{
                                type: 'item',
                                index: 3,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }]
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: true,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        continue: true,
                        children: [{
                            type: 'list',
                            listType: 'bulleted',
                            listTight: false,
                            continue: true,
                            children: [{
                                type: 'item',
                                index: 4,
                                children: [{
                                    type: 'paragraph',
                                    children: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: true,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 1,
                        continue: true,
                        children: [{
                            type: 'list',
                            listType: 'bulleted',
                            listTight: false,
                            continue: true,
                            children: [{
                                type: 'item',
                                index: 4,
                                continue: true,
                                children: [{
                                    type: 'paragraph',
                                    continue: true,
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        type: 'item',
                        index: 2,
                        children: [{
                            type: 'list',
                            listType: 'ordered',
                            listTight: true,
                            children: [{
                                type: 'item',
                                index: 1,
                                children: [{
                                    type: 'paragraph',
                                    children: []
                                }]
                            }]
                        }]
                    }],
                }, {
                    type: 'image',
                    src: 'http://example.com/image',
                    children: [{
                        type: 'text',
                        literal: 'an image'
                    }]
                }, {
                    type: 'list',
                    listType: 'ordered',
                    listTight: true,
                    continue: true,
                    children: [{
                        type: 'item',
                        index: 2,
                        continue: true,
                        children: [{
                            type: 'list',
                            listType: 'ordered',
                            listTight: true,
                            continue: true,
                            children: [{
                                type: 'item',
                                index: 1,
                                continue: true,
                                children: [{
                                    type: 'paragraph',
                                    continue: true,
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }, {
                                type: 'item',
                                index: 2,
                                children: [{
                                    type: 'paragraph',
                                    children: [{
                                        type: 'text',
                                        literal: 'This is text'
                                    }]
                                }]
                            }]
                        }]
                    }]
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

            assert.ok(verifyAst(actual));
            assert.deepStrictEqual(actual, expected);
        });

        // it('complex example with images', () => {
        //     const inputString = '- abc\n    1. def\n\n    2. ghi\n\n3. jkl\n- mno\n    1. pqr\n---\n# vwx\n\nyz';
        //     const input = parser.parse(inputString);
        //     const expected = parser.parse(inputString);
        //     const actual = pullOutImages(input);

        //     assert.ok(verifyAst(actual));
        //     assert.deepStrictEqual(actual, expected);
        // });
    });
});




            // if (astToString(expected) === astToString(actual)) {
            //     console.log('AST strings are equal');
            // } else {
            //     console.log('---------------------------ACTUAL------------------------------');
            //     console.log(astToString(actual));
            //     console.log('--------------------------EXPECTED-----------------------------');
            //     console.log(astToString(expected));
            // }

            // fs.writeFile('./actual', astToString(actual));
            // fs.writeFile('./actual.json', astToJson(actual));
            // fs.writeFile('./expected', astToString(expected));
            // fs.writeFile('./expected.json', astToJson(expected));
