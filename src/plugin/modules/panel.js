
/* DOC: jslint configuration
 * The following two comment sections are instructions to jslint, to 
 * provide exceptions to allow for less noisy but still useful linting.
 */
/*global define  */
/*jslint browser:true,white:true */

/* DOC: requirejs define
 * Note that this is an anonymous define. The module name for this panel is 
 * provided in require-config.js, which associates a string key with this module file.
 * The only dependency required to implement a panel is a promises library,
 * in this case Q (cit. here).
 * It is very commong to have jquery and kb.html also included, as they
 * assist greatly in building html and manipulating the DOM, and kb.runtime
 * since it is the primary interface to the user interface runtime.
 * In addition, any widgets will need to be included here as well.
 * (Well, some usage patterns may load widgets in a different way, but this
 *  sample panel represents a moderately straightforward implementation.)
 *  
 *  Formatting: I find that listing each module name on a separate line 
 *  enhances readability.
 * 
 */

define([
    'bluebird',
    'jquery',
    'kb/common/html',
    'kb/widget/widgetSet'
],
    function (Promise, $, html, WidgetSet) {
        /* DOC: strict mode
         * We always set strict mode with the following magic javascript
         * incantation.
         */
        'use strict';

        function factory(config) {
            /* DOC: widget variables and factory pattern
             * In the factory pattery for object creation, we can just
             * declare variables within the factory function, and they 
             * are naturally available to all functions defined within.
             * 
             * In this case we need to store references to the original 
             * DOM node passed during attachment (mount), the DOM node
             * created by the Panel for its own use (container),
             * and an array of subwidgets (children).
             */
            var parent, 
                container,
                runtime = config.runtime,
                widgetSet = WidgetSet.make({
                    runtime: runtime
                });

            /* DOC helper functions
             * Although not part of the Panel Interface, a common pattern is
             * to have a sert of helper functions. This assists in meeting 
             * the coding standard of short, understandable, single-purposed
             * functions.
             * A very common helper funcion is a renderer. A panel may have 
             * more then one render function, e.g. to represent different
             * states. In this case, the render function simply builds a
             * layout upon which it will attache widgets.
             * 
             */
            function layout() {
                /*
                 * DOC: html helper module
                 * The kb.html helper module is quite useful for building 
                 * html in a functional style. It has a generic tag function
                 * builder, as well as methods to build more complex html
                 * structures.
                 */
                var t = html.tag,
                    h1 = t('h1'),
                    div = t('div');

                /* DOC: return some structure
                 * The render function returns enough structure to represent
                 * what needs to be rendered. This is not hard-coded at all, 
                 * and is just a convention within this panel. It has turned
                 * out, however, to be a useful pattern.
                 */
                return {
                    title: 'Sample Panel',
                    content: div({class: 'kb-panel-sample'}, [
                        h1('Sample Panel and Widgets'),
                        div({class: 'row'}, [
                            div({class: 'col-md-6'}, [
                                'Will be here...',
                                html.bsPanel('Sample Widget 1', div({id: widgetSet.addWidget('kb-sample-widget1')}))
                            ])
                        ])
                    ])
                };
            }

            /* DOC: create lifecycle event
             * The create lifecycle event is the only synchronous one. 
             * This is because object creation, in its many forms, may
             * not always be naturally implementable as a promise.
             * In this case, we are trying to exemplify how a Panel can
             * strictly follow the widget lifecycle interface, and mangage
             * its sub-widgets along exactly the same trajectory. In reality,
             * sometimes a sub-widgets lifecyle events won't necessarily 
             * correspond to the parent widget's events.
             */

            /* DOC: init event
             * Since a panel implements the widget interface, it starts 
             * with an init event handler. The init event gives the panel
             * a chance to set up whetever it needs, and to fail early if
             * the proper conditions are not met.
             * In this case, we really just need to initialize the sub-widgets.
             * 
             */
            function init(config) {
                return widgetSet.init(config);
            }

            /* DOC: attach event
             * This attach() function implements the attach lifecycle event
             * in the Panel Widget lifecycle interface.
             * It is invoked at  point at which the parent environment has
             * obtained a concerete DOM node at which to attach this Panel,
             * and is ready to allow the Panel to attach itself to it.
             * The Panel should not do anything with the provided node
             * other than attach its own container node. This is because 
             * in some environments, it may be that the provided node is
             * long lived. A panel should not, for example, attach DOM listeners
             * to it.
             * 
             */
            function attach(node) {
                    /* DOC: creating our attachment point
                     *  Here we save the provided node in the mount variable,
                     *  and attach our own container node to it. This pattern
                     *  allows us to attach event listeners as we wish to 
                     *  our own container, so that we have more control
                     *  over it. E.g. we can destroy and recreate it if we
                     *  want another set of event listeners and don't want
                     *  to bother with managing them all individually.
                     */
                    parent = node;
                    container = document.createElement('div');
                    parent.appendChild(container);

                    /* DOC: dom access
                     * In this case we are keeping things simple by using 
                     * the plain DOM API. We could also use jquery 
                     * here if we wish to.
                     */
                    container.innerHTML = layout();

                    /* DOC: runtime interface
                     * Since a panel title is also, logically, the title of
                     * the "page" we use the runtimes event bus to emit the
                     * 'title' event to the application. The application 
                     * takes care of modifying the window panel to accomodate
                     * it.
                     */
                    runtime.send('ui', 'setTitle', 'Sample Plugin Title');

                    /* DOC: implement widget manager attach lifecycle event
                     * Okay, here we run all of the widgets through the 
                     * 
                     */
                    return widgetSet.attach(node);
            }
            function start(params) {
                return widgetSet.start(params);
            }
            function run(params) {
                return widgetSet.run(params);
            }
            function stop() {
                return widgetSet.stop();
            }
            function detach() {
                return widgetSet.detach()
                    .then(function () {
                        parent.removeChild(container);
                    });
            }
            function destroy() {
                return widgetSet.destroy();
            }

            return Object.freeze({
                init: init,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach,
                destroy: destroy
            });
        }

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });