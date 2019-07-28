/*
 * WAI-ARIA plugin
 *
 * - Adds keyboard navigation controls to form fields
 */
+ function($) {
    "use strict";

    /*
     * Tab - Move forwards
     * Shift and Tab - Move backwards
     * Enter - Select that tab (PC)
     * Space bar - Select that tab (MAC)
     * Home - First tab
     * End - Last tab
     * Arrow Keys - Scroll through the tabs
     */
    function whiteList() {
        var whitelist = [
            'ArrowLeft',
            'ArrowUp',
            'ArrowDown',
            'ArrowRight',
            'Home',
            'End',
            'Tab',
            'Shift',
            'Enter',
            '(Space character)',
            'Spacebar',
            ' '
        ];

        if ((event.shiftKey && event.key === 'Tab') || (event.type === 'keydown' && !whitelist.includes(event.key))) {
            return;
        }
    };

    // Add WAI-ARIA role group for radio buttons
    $('.radio-field').attr('role', 'radiogroup');

    /*
     * Radio buttons
     */
    $('body').on('click keydown', '.custom-radio input[role="radio"]', function(event) {
        // Run whitelist checker
        whiteList();

        var $target = $(event.currentTarget),
            parentContainer = $target.closest('.radio-field');

        // Remove WAI-ARIA checked and HTML checked attributes
        $(parentContainer).find('input[role="radio"]').attr({
            'aria-checked': 'false',
            'tabindex': '-1',
            'checked': false
        });

        // Add WAI-ARIA checked and HTML checked attributes to focus element
        $(parentContainer).find('input[role="radio"]:checked').attr({
            'aria-checked': 'true',
            'tabindex': '0',
            'checked': true
        });
    });

    /*
     * Tabs
     */
    $('body').on('click keydown', '.master-tabs a[role="tab"],.primary-tabs a[role="tab"],.secondary-tabs a[role="tab"],.content-tabs a[role="tab"]', function(event) {
        // Run whitelist checker
        whiteList();

        var $target = $(event.currentTarget),
            tabName = '',
            tabPanel = $target.attr('data-target');

        if ($target.closest('.master-tabs').length) {
            tabName = '.master-tabs';
        } else if ($target.closest('.primary-tabs').length) {
            tabName = '.primary-tabs';
        } else if ($target.closest('.secondary-tabs').length) {
            tabName = '.secondary-tabs';
        } else if ($target.closest('.content-tabs').length) {
            tabName = '.content-tabs';
        }

        // Set all tabs to false
        $(tabName + ' a').attr('aria-selected', 'false');
        // Set all tab panels to hidden
        $(tabName + ' div.tab-pane').attr('hidden', 'hidden');

        // Add wai-aria selected on the active tab
        $target.attr('aria-selected', 'true');
        // Remove hidden attribute on active tab panel
        $(tabPanel).attr('hidden', false);

        var strikeUpOrRightTab = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
        var strikeDownOrLeftTab = event.key === 'ArrowDown' || event.key === 'ArrowRight';
        if (strikeUpOrRightTab || strikeDownOrLeftTab) {
            event.preventDefault();

            var position = strikeUpOrRightTab ? 'first-child' : 'last-child';
            var $activated = $(tabName + ' a[aria-selected="true"]').parent();
            if ($activated.is(tabName + ' li:' + position)) {
                $(tabName + ' li:' + position + ' a').click().focus();
            } else {
                // else activate previous
                $activated.prev().children(tabName + ' a').click().focus();
            }
        } else if (event.key === 'Home') {
            event.preventDefault();

            $(tabName + ' li ' + ' a').first().click().focus();
        } else if (event.key === 'End') {
            event.preventDefault();

            $(tabName + ' li ' + ' a').end().click().focus();
        }

        // Important - Must be set to true for October to set class="active" in the <li>
        return true;
    });

}(window.jQuery);