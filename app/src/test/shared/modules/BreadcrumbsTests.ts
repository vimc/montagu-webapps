
import {breadcrumbsModule} from "../../../main/shared/modules/breadcrumbs";

describe('Breadcrumbs Module Tests', () => {
    it('initializes empty array if null passed', () => {
        expect(breadcrumbsModule.initialize(null)).toEqual([]);
    });

    it('initializes breadcrumb with one element', () => {
        expect(breadcrumbsModule.initialize({
            name: 'A',
            urlFragment: '/',
            parent: null
        })).toEqual([{
            name: 'A',
            url: '/',
        }]);
    });

    it('initializes breadcrumb with one element', () => {
        expect(breadcrumbsModule.initialize({
            name: 'A',
            urlFragment: '/',
            parent: null
        })).toEqual([{
            name: 'A',
            url: '/',
        }]);
    });

    it('reformats from tree to array', () => {
        expect(breadcrumbsModule.getParentsInOrderFromTopToBottom({
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        })).toEqual([{
            name: 'A',
            urlFragment: '/',
            parent: null
        },{
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        }]);
    });

    it('creates url adding all url fragments', () => {
        expect(breadcrumbsModule.url({
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        })).toEqual("/b/");
    });
});