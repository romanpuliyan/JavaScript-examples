(function() {

angular.module('stroiman').controller('ProfileAllItemsCtrl', ProfileAllItemsController);

angular.$inject = [
    'profileAllItemsService',
    '$timeout',
    '$window',
    'ITEM_NAME_FOR_EVENT_CONSTRUCTION',
    'ITEM_NAME_FOR_EVENT_ANNOUNCEMENT',
    'ITEM_NAME_FOR_EVENT_PROPOSAL',
    'ITEM_NAME_FOR_EVENT_TEASER',
    'TAB_NAME_ALL',
    'TAB_NAME_ANNOUNCEMENT',
    'TAB_NAME_CONSTRUCTION',
    'TAB_NAME_PROPOSAL'
];

function ProfileAllItemsController(
        $scope,
        $rootScope,
        profileAllItemsService,
        $timeout,
        $window,
        ITEM_NAME_FOR_EVENT_CONSTRUCTION,
        ITEM_NAME_FOR_EVENT_ANNOUNCEMENT,
        ITEM_NAME_FOR_EVENT_PROPOSAL,
        ITEM_NAME_FOR_EVENT_TEASER,
        TAB_NAME_ALL,
        TAB_NAME_ANNOUNCEMENT,
        TAB_NAME_CONSTRUCTION,
        TAB_NAME_PROPOSAL
    )
{

    // VARS
    $scope.pgPages          = [];
    $scope.pgPageCurrent    = 1;
    $scope.pgPerPage        = 20;
    $scope.pgTotalPageCount = 1;
    $scope.pgPageCount      = 5;
    $scope.pgFirstPage      = 1;
    $scope.pgLastPage       = 1;
    $scope.pgOffset         = 2;
    $scope.pgPerPageSet     = [20, 30, 50];

    // init vars
    $scope.initialized      = false;
    $scope.tab              = null;
    $scope.innerTabClicked  = false;
    $scope.itemNameForEvent = '';

    $scope.profile     = {};
    $scope.items       = [];
    $scope.dateFrom    = '';
    $scope.dateTo      = '';
    $scope.filterType  = [];
    $scope.filterState = [];
    $scope.filterPaid  = [];
    $scope.noRows      = null;
    $scope.requestSent = false;

    $scope.checkedItemsToGroupDelete = [];

    // filter state selectors
    $scope.profileItemsStateAll      = 'profileItemsStateAll';
    $scope.profileItemsStateActive   = 'profileItemsStateActive';
    $scope.profileItemsStateReturned = 'profileItemsStateReturned';
    $scope.profileItemsStateArchived = 'profileItemsStateArchived';

    $scope.profileItemsFilterWrapperStateAll  = 'profileItemsFilterWrapperStateAll';
    $scope.profileItemsFilterWrapperStateItem = 'profileItemsFilterWrapperStateItem';

    // filter paid selectors
    $scope.profileItemsPaidAll  = 'profileItemsPaidAll';
    $scope.profileItemsPaidPaid = 'profileItemsPaidPaid';
    $scope.profileItemsPaidFree = 'profileItemsPaidFree';

    $scope.profileItemsFilterWrapperPaidAll  = 'profileItemsFilterWrapperPaidAll';
    $scope.profileItemsFilterWrapperPaidItem = 'profileItemsFilterWrapperPaidItem';

    // item names for events
    $scope.itemNameForEventConstruction = ITEM_NAME_FOR_EVENT_CONSTRUCTION;
    $scope.itemNameForEventAnnouncement = ITEM_NAME_FOR_EVENT_ANNOUNCEMENT;
    $scope.itemNameForEventProposal     = ITEM_NAME_FOR_EVENT_PROPOSAL;
    $scope.itemNameForEventTeaser       = ITEM_NAME_FOR_EVENT_TEASER;

    // tab names
    $scope.tabNameAll          = TAB_NAME_ALL;
    $scope.tabNameAnnouncement = TAB_NAME_ANNOUNCEMENT;
    $scope.tabNameConstruction = TAB_NAME_CONSTRUCTION;
    $scope.tabNameProposal     = TAB_NAME_PROPOSAL;

    // FUNCTIONS
    $scope.init                   = init;
    $scope.waitForInit            = waitForInit;
    $scope.innerTabClick          = innerTabClick;
    $scope.getList                = getList;
    $scope.movePageTop            = movePageTop;
    $scope.moveToEditProfile      = moveToEditProfile;
    $scope.moveToCompanyView      = moveToCompanyView;
    $scope.prolongTopCompany      = prolongTopCompany;
    $scope.prolongAutocomment     = prolongAutocomment;
    $scope.announcementPayPreview = announcementPayPreview;
    $scope.constructionEditForm   = constructionEditForm;
    $scope.teaserPeriodSlider     = teaserPeriodSlider;
    $scope.standartProcessByHref  = standartProcessByHref;
    $scope.standartDeleteByHref   = standartDeleteByHref;
    $scope.disableHref            = disableHref;
    $scope.constructionWasUpdated = constructionWasUpdated;

    // delete items
    $scope.checkItemToGroupDelete  = checkItemToGroupDelete;
    $scope.groupDeleteCheckedItems = groupDeleteCheckedItems;

    // calendar
    $scope.closeCalendar     = closeCalendar;
    $scope.resetCalendarFrom = resetCalendarFrom;
    $scope.resetCalendarTo   = resetCalendarTo;

    // filter
    $scope.selectFilterType       = selectFilterType;
    $scope.selectFilterState      = selectFilterState;
    $scope.selectFilterPaid       = selectFilterPaid;
    $scope.selectFilterAllTypes   = selectFilterAllTypes;
    $scope.selectFilterAllStates  = selectFilterAllStates;
    $scope.selectFilterAllPaids   = selectFilterAllPaids;
    $scope.checkFilterTypeActive  = checkFilterTypeActive;
    $scope.checkFilterStateActive = checkFilterStateActive;
    $scope.checkFilterPaidActive  = checkFilterPaidActive;
    $scope.closePopupFilter       = closePopupFilter;
    $scope.resetFilter            = resetFilter;

    // paginator
    $scope.pgNoPrevious    = paginatorNoPrevious;
    $scope.pgNoNext        = paginatorNoNext;
    $scope.pgPageChange    = paginatorPageChange;
    $scope.pgPerPageChange = paginatorPerPageChange;
    $scope.pgMovePrevious  = paginatorMovePrevious;
    $scope.pgMoveNext      = paginatorMoveNext;
    $scope.pgReset         = paginatorReset;
    $scope.pgCreatePages   = paginatorCreatePages;

    // EVENT
    $scope.eventEmit    = eventEmit;
    $scope.eventObserve = eventObserve;
    $scope.groupDeletedEventEmit = groupDeletedEventEmit;

    // WATCH
    $scope.$watch('dateFrom', function(newValue, oldValue) {
        if(oldValue == '' && newValue == '') {
            return;
        }

        if(newValue != '') {
            $scope.pgReset();
            $scope.getList();
        }
    });

    $scope.$watch('dateTo', function(newValue, oldValue) {
        if(oldValue == '' && newValue == '') {
            return;
        }

        if(newValue != '') {
            $scope.pgReset();
            $scope.getList();
        }
    });


    // FUNCTIONS
    function init(tab) {
        $scope.tab = tab;
        $scope.initialized = true;

        // filter state selectors
        $scope.profileItemsStateAll      += ('_' + tab);
        $scope.profileItemsStateActive   += ('_' + tab);
        $scope.profileItemsStateReturned += ('_' + tab);
        $scope.profileItemsStateArchived += ('_' + tab);

        $scope.profileItemsFilterWrapperStateAll  += ('_' + tab);
        $scope.profileItemsFilterWrapperStateItem += ('_' + tab);

        // filter paid selectors
        $scope.profileItemsPaidAll  += ('_' + tab);
        $scope.profileItemsPaidPaid += ('_' + tab);
        $scope.profileItemsPaidFree += ('_' + tab);

        $scope.profileItemsFilterWrapperPaidAll  += ('_' + tab);
        $scope.profileItemsFilterWrapperPaidItem += ('_' + tab);
    }

    function waitForInit() {
        $timeout(function() {
            if($scope.initialized == true) {
                $scope.getList();
                $scope.eventObserve();
            }
            else {
                $scope.waitForInit();
            }
        }, 500);
    }

    function innerTabClick() {
        if($scope.innerTabClicked == false) {
            $scope.waitForInit();
        }

        $scope.innerTabClicked = true;
    }

    function getList() {

        var page     = $scope.pgPageCurrent;
        var perPage  = $scope.pgPerPage;
        var tab      = $scope.tab;
        var dateFrom = $scope.dateFrom;
        var dateTo   = $scope.dateTo;
        var type     = $scope.filterType.join('-');
        var state    = $scope.filterState.join('-');
        var paid     = $scope.filterPaid.join('-');

        profileAllItemsService
            .getList(page, perPage, tab, dateFrom, dateTo, type, state, paid)
            .then(getListSuccess, getListError);
    }

    function movePageTop() {
        angular.element(".top-mobile").click();
    }

    function moveToEditProfile() {
        angular.element(".companyTab").click();
        angular.element(".companyMainTab").click();
    }

    function moveToCompanyView(href) {

        var promise = checkProfileFilled();
        promise.then(function(data, textStatus, jqXHR) {
            $window.location.href = href;
        }, function(jqXHR, textStatus, errorThrown) {

        });
    }

    function prolongTopCompany() {

        var element = angular.element(".prolongCompanyButtonList");
        if(!$scope.disableHref(element)) {
            return;
        }

        var promise = checkAuthExpired();
        promise.then(function( data, textStatus, jqXHR ) {
            var promise = checkProfileFilled();
            promise.then(function(data, textStatus, jqXHR) {
                profileAllItemsService
                    .companyPayPreview()
                    .then(companyPreviewSuccess, companyPreviewError);
            }, function(jqXHR, textStatus, errorThrown) {

            });
        }, function( jqXHR, textStatus, errorThrown ) {

        });
    }

    function prolongAutocomment($event) {

        var button = $($event.target);
        if(button.hasClass("prolongAutocommentButtonList")) {
            if(!$scope.disableHref(button)) {
                return;
            }
        }

        var promise = checkAuthExpired();
        promise.then(function( data, textStatus, jqXHR ) {
            profileAllItemsService
                .autocommentPayPreview()
                .then(autocommentPreviewSuccess, autocommentPreviewError);
        }, function( jqXHR, textStatus, errorThrown ) {

        });
    }

    function announcementPayPreview($event, href) {

        if(href) {

            var button = $($event.target);
            if(button.hasClass("announcementPayPreviewButtonList")) {
                if(!$scope.disableHref(button)) {
                    return;
                }
            }

            var promise = checkAuthExpired();
            promise.then(function( data, textStatus, jqXHR ) {
                profileAllItemsService
                    .standartProcessByHref(href)
                    .then(announcementPreviewSuccess, announcementPreviewError);
            }, function( jqXHR, textStatus, errorThrown ) {

            });
        }
    }

    function constructionEditForm(href) {

        if(href) {
            var promise = checkAuthExpired();
            promise.then(function( data, textStatus, jqXHR ) {
                profileAllItemsService
                    .standartProcessByHref(href)
                    .then(constructionEditFormSuccess, constructionEditFormError);
            }, function( jqXHR, textStatus, errorThrown ) {

            });
        }
    }

    function teaserPeriodSlider($event, href) {

        if(href) {

            var button = $($event.target);
            if(button.hasClass("prolongTeaserButtonList")) {
                if(!$scope.disableHref(button)) {
                    return;
                }
            }

            var promise = checkAuthExpired();
            promise.then(function( data, textStatus, jqXHR ) {
                profileTeaserPeriodSlider(href);
            }, function( jqXHR, textStatus, errorThrown ) {

            });
        }
    }

    function standartProcessByHref($event, href, selectorClass, itemNameForEvent) {

        if(href) {

            if(selectorClass) {
                var button = $($event.target);
                if(button.hasClass(selectorClass)) {
                    if(!$scope.disableHref(button)) {
                        return;
                    }
                }
            }

            var promise = checkAuthExpired();
            promise.then(function( data, textStatus, jqXHR ) {

                $scope.itemNameForEvent = itemNameForEvent;

                profileAllItemsService
                    .standartProcessByHref(href)
                    .then(standartListHandlerSuccess, standartListHandlerError);
            }, function( jqXHR, textStatus, errorThrown ) {

            });
        }
    }

    function standartDeleteByHref(href, itemNameForEvent) {

        if(href) {

            var result = confirm('Вы действительно хотите удалить запись?');
            if(result) {
                var promise = checkAuthExpired();
                promise.then(function( data, textStatus, jqXHR ) {

                    $scope.itemNameForEvent = itemNameForEvent;

                    profileAllItemsService
                        .standartProcessByHref(href)
                        .then(standartListHandlerSuccess, standartListHandlerError);
                }, function( jqXHR, textStatus, errorThrown ) {

                });
            }
        }
    }

    function disableHref(element) {

        if(element.hasClass("clicked")) {
            return false;
        }

        loadingAjaxStart(element);
        element.addClass("clicked");

        return true;
    }

    function constructionWasUpdated() {
        $scope.getList();
        $scope.pgCreatePages();
    }


    // GROUP DELETE ITEMS
    function checkItemToGroupDelete($event) {

        var checkbox = $($event.target);
        var value    = checkbox.val();
        var checked  = checkbox.is(":checked");

        if(checked) {
            $scope.checkedItemsToGroupDelete.push(value);
        }
        else {
            var index = $scope.checkedItemsToGroupDelete.indexOf(value);
            $scope.checkedItemsToGroupDelete.splice(index, 1);
        }
    }

    function groupDeleteCheckedItems($event) {

        if($scope.checkedItemsToGroupDelete.length == 0) {
            return;
        }

        var button = $($event.target);
        var href = button.attr("data-resolved-url");

        var result = confirm('Вы действительно хотите удалить записи?');
        if(result) {
            var promise = checkAuthExpired();
            promise.then(function( data, textStatus, jqXHR ) {
                profileAllItemsService
                    .groupDelete(href, $scope.checkedItemsToGroupDelete)
                    .then(groupDeleteHandlerSuccess, standartListHandlerError);
            }, function( jqXHR, textStatus, errorThrown ) {

            });
        }
    }



    // CALENDAR
    function closeCalendar(elementClass) {
        angular.element('.' + elementClass).slideUp(600);
    }

    function resetCalendarFrom($event) {
        $scope.dateFrom = '';
        $scope.pgReset();
        $scope.getList();

        var button = $($event.target);
        var calendarBlock = button.parents(".tab-finance__input");

        resetCalendar(calendarBlock);
    }

    function resetCalendarTo($event) {
        $scope.dateTo = '';
        $scope.pgReset();
        $scope.getList();

        var button = $($event.target);
        var calendarBlock = button.parents(".tab-finance__input");

        resetCalendar(calendarBlock);
    }



    // FILTERS
    function selectFilterType(type, elementId) {

        angular.element(".profileItemsFilterWrapperTypeAll").removeClass("active");
        angular.element("#profileItemsTypeAll").attr("checked", false);

        if(angular.element('#' + elementId).is(":checked")) {
            $scope.filterType.push(type);
        }
        else {
            var index = $scope.filterType.indexOf(type);
            $scope.filterType.splice(index, 1);
        }

        $scope.pgReset();
        $scope.getList();
    }

    function selectFilterState(state, baseElementId) {

        var elementId = $scope.$eval(baseElementId);

        angular.element("." + $scope.profileItemsFilterWrapperStateAll).removeClass("active");
        angular.element("#" + $scope.profileItemsStateAll).attr("checked", false);

        if(angular.element('#' + elementId).is(":checked")) {
            $scope.filterState.push(state);
        }
        else {
            var index = $scope.filterState.indexOf(state);
            $scope.filterState.splice(index, 1);
        }

        $scope.pgReset();
        $scope.getList();
    }

    function selectFilterPaid(paid, baseElementId) {

        var elementId = $scope.$eval(baseElementId);

        angular.element("." + $scope.profileItemsFilterWrapperPaidAll).removeClass("active");
        angular.element("#" + $scope.profileItemsPaidAll).attr("checked", false);

        if(angular.element('#' + elementId).is(":checked")) {
            $scope.filterPaid.push(paid);
        }
        else {
            var index = $scope.filterPaid.indexOf(paid);
            $scope.filterPaid.splice(index, 1);
        }

        $scope.pgReset();
        $scope.getList();
    }

    function selectFilterAllTypes() {

        var filterTypeSelected = false;

        if($scope.filterType.length != 0) {
            filterTypeSelected = true;
        }

        $scope.filterType = [];
        angular.element(".profileItemsFilterWrapperTypeItem").removeClass("active");

        if(filterTypeSelected) {
            $scope.pgReset();
            $scope.getList();
        }
    }

    function selectFilterAllStates() {

        var filterStateSelected = false;

        if($scope.filterState.length != 0) {
            filterStateSelected = true;
        }

        $scope.filterState = [];
        angular.element("." + $scope.profileItemsFilterWrapperStateItem).removeClass("active");

        if(filterStateSelected) {
            $scope.pgReset();
            $scope.getList();
        }
    }

    function selectFilterAllPaids() {

        var filterPaidSelected = false;

        if($scope.filterPaid.length != 0) {
            filterPaidSelected = true;
        }

        $scope.filterPaid = [];
        angular.element("." + $scope.profileItemsFilterWrapperPaidItem).removeClass("active");

        if(filterPaidSelected) {
            $scope.pgReset();
            $scope.getList();
        }
    }

    function checkFilterTypeActive(type) {

        if(!type) {
            return false;
        }

        if($scope.filterType.indexOf(type.toString()) >= 0) {
            return true;
        }

        if($scope.filterType.indexOf(type) >= 0) {
            return true;
        }

        return false;
    }

    function checkFilterStateActive(state) {

        if(!state) {
            return false;
        }

        if($scope.filterState.indexOf(state.toString()) >= 0) {
            return true;
        }

        if($scope.filterState.indexOf(state) >= 0) {
            return true;
        }

        return false;
    }

    function checkFilterPaidActive(paid) {

        if(!paid) {
            return false;
        }

        if($scope.filterPaid.indexOf(paid.toString()) >= 0) {
            return true;
        }

        if($scope.filterPaid.indexOf(paid) >= 0) {
            return true;
        }

        return false;
    }

    function closePopupFilter() {
        angular.element('.sorting__popup3').slideUp(600);
    }

    function resetFilter() {

        var someFilterSelected = false;

        if($scope.filterType.length != 0) {
            someFilterSelected = true;
        }
        if($scope.filterState.length != 0) {
            someFilterSelected = true;
        }
        if($scope.filterPaid.length != 0) {
            someFilterSelected = true;
        }

        $scope.filterType  = [];
        $scope.filterState = [];
        $scope.filterPaid  = [];

        // RESET TYPE
        if($scope.tab == 'all') {
            angular.element(".profileItemsFilterWrapperTypeItem").removeClass("active");
            angular.element(".profileItemsFilterWrapperTypeAll").removeClass("active");
            angular.element("#profileItemsTypeAll").attr("checked", false);
        }

        // RESET STATE
        angular.element("." + $scope.profileItemsFilterWrapperStateItem).removeClass("active");
        angular.element("." + $scope.profileItemsFilterWrapperStateAll).removeClass("active");
        angular.element("#" + $scope.profileItemsStateAll).attr("checked", false);

        // RESET PAID
        angular.element("." + $scope.profileItemsFilterWrapperPaidItem).removeClass("active");
        angular.element("." + $scope.profileItemsFilterWrapperPaidAll).removeClass("active");
        angular.element("#" + $scope.profileItemsPaidAll).attr("checked", false);

        if(someFilterSelected) {
            $scope.pgReset();
            $scope.getList();
        }
    }



    // PAGINATOR
    function paginatorNoPrevious() {
        return 1 == $scope.pgPageCurrent;
    }

    function paginatorNoNext() {
        return $scope.pgPageCurrent == $scope.pgTotalPageCount;
    }

    function paginatorPageChange(page) {
        $scope.pgPageCurrent = page;
        $scope.getList();
        $scope.movePageTop();
    }

    function paginatorPerPageChange(perPage) {
        $scope.pgPerPage = perPage;
        $scope.pgReset();
        $scope.getList();
        $scope.movePageTop();
    }

    function paginatorMovePrevious() {
        if($scope.pgPageCurrent <= 1) {
            return;
        }

        $scope.pgPageCurrent--;
        $scope.getList();
        $scope.movePageTop();
    }

    function paginatorMoveNext() {
        if($scope.pgPageCurrent >= $scope.pgTotalPageCount) {
            return;
        }

        $scope.pgPageCurrent++;
        $scope.getList();
        $scope.movePageTop();
    }

    function paginatorReset() {
        $scope.pgPageCurrent = 1;
        $scope.pgFirstPage   = 1;
        $scope.pgLastPage    = 1;

        $scope.pgCreatePages();
    }

    function paginatorCreatePages() {
        $scope.pgPages = [];

        // FIRST PAGE
        if($scope.pgFirstPage != $scope.pgPageCurrent) {
            if($scope.pgPageCurrent > $scope.pgOffset) {
                $scope.pgFirstPage = $scope.pgPageCurrent - $scope.pgOffset;
            }
        }
        else {
            if($scope.pgPageCurrent > 1) {
                if($scope.pgPageCurrent <= $scope.pgOffset) {
                    var firstPage = $scope.pgPageCurrent - $scope.pgOffset;
                    if(firstPage <= 0) {
                        firstPage = 1;
                    }

                    $scope.pgFirstPage = firstPage;
                }
                else {
                    $scope.pgFirstPage = $scope.pgPageCurrent - $scope.pgOffset;
                }
            }
        }

        // LAST PAGE
        $scope.pgLastPage = ($scope.pgFirstPage + $scope.pgPageCount) - 1;
        if($scope.pgLastPage > $scope.pgTotalPageCount) {
            $scope.pgLastPage = $scope.pgTotalPageCount;
        }

        // PAGES
        for(var i = $scope.pgFirstPage; i <= $scope.pgLastPage; i++) {

            if(i > $scope.pgTotalPageCount) {
                break;
            }

            var page = new Object();
            page.page = i;
            page.active = false;
            if($scope.pgPageCurrent == i) {
                page.active = true;
            }

            $scope.pgPages.push(page);
        }
    }



    // HANDLERS
    function getListSuccess(response) {

        $scope.profile = response.data.profile;

        $scope.items = [];
        angular.forEach(response.data.rows, function(item, index) {
            $scope.items.push(item);
        });

        if($scope.requestSent == false) {

            if($scope.items.length == 0) {
                $scope.noRows = true;
            }

            $scope.requestSent = true;
        }

        $scope.pgTotalPageCount = response.data.totalPageCount;
        $scope.pgCreatePages();

        uncheckMainDeleteCheckbox($scope.tab);
        checkDeleteItems($scope.tab);
    }

    function getListError(response) {
        // alert
    }

    function companyPreviewSuccess(response) {

        // очистить старый попап со слайдером
        clearPopupWithSlider();

        var popupCompanyWrap = $(".companyWrap");
        popupCompanyWrap.html('');
        popupCompanyWrap.html(response.data);

        // инициализируем попап
        initProfileCompanyPreview();

        // инициализируем слайдер
        initSlider();

        profileImproveCompanyButtonClick();
        profileProlongCompanyButtonClick();

        loadingAjaxEnd();
        angular.element(".prolongCompanyButtonList").removeClass("clicked");
    }

    function companyPreviewError(response) {
        showErrorJsMessage('При попытке оплаты ТОП-компании произошла ошибка');

        loadingAjaxEnd();
    }

    function autocommentPreviewSuccess(response) {

        // очистить старый попап со слайдером
        clearPopupWithSlider();

        var popupCompanyWrap = $(".autocommentWrap");
        popupCompanyWrap.html('');
        popupCompanyWrap.html(response.data);

        // инициализируем попап
        initProfileAutocommentPreview();

        // инициализируем слайдер
        initSlider();

        profileProlongAutocommentButtonClick();

        loadingAjaxEnd();
        angular.element(".prolongAutocommentButtonList").removeClass("clicked");
    }

    function autocommentPreviewError(response) {
        showErrorJsMessage('При попытке оплаты автопубликации произошла ошибка');
    }

    function announcementPreviewSuccess(response) {

        // очистить старый попап со слайдером
        clearPopupWithSlider();

        var popupAnnouncementWrap = $(".announcementWrap");
        popupAnnouncementWrap.html('');
        popupAnnouncementWrap.html(response.data);

        // инициализируем попап
        initProfileAnnouncementPreview();

        // инициализируем слайдер
        initSlider();

        profileImproveAnnouncementButtonClick();
        profileProlongAnnouncementButtonClick();

        loadingAjaxEnd();
        angular.element(".announcementPayPreviewButtonList").removeClass("clicked");
    }

    function announcementPreviewError(response) {
        showErrorJsMessage('При попытке оплаты ТОП-объявления произошла ошибка');
    }

    function constructionEditFormSuccess(response) {

        $(".popups-order__wrap").html('');
        $(".popups-order__wrap").html(response.data);

        if($('#popups-order__text-counter').length > 0) {
            $('#popups-order__text-counter').limit('1000','#popups-order__count');
        }

        initProfileConstructionPopupEditForm();

        regionChange();
        headerFocusInput();
        filterPhone();
        constructionFormSubmit();
        //constructionSlider();
    }

    function constructionEditFormError(response) {
        showErrorJsMessage('При попытке редактирования заказа произошла ошибка');
    }

    function standartListHandlerSuccess(response) {
        showSuccessJsMessage(response.data.message);

        $scope.getList();
        $scope.pgCreatePages();
        $scope.eventEmit();

        loadingAjaxEnd();
        removeClickedClass();
    }

    function standartListHandlerError(response) {
        showErrorJsMessage(response.data.message);
    }

    function groupDeleteHandlerSuccess(response) {
        showSuccessJsMessage(response.data.message);

        $scope.getList();
        $scope.pgCreatePages();
        $scope.groupDeletedEventEmit();

        $scope.checkedItemsToGroupDelete = [];
    }

    function eventEmit() {

        if($scope.itemNameForEvent.length == 0) {
            return;
        }

        var eventName = '';
        switch($scope.itemNameForEvent) {
            case $scope.itemNameForEventConstruction:
                switch($scope.tab) {
                    case $scope.tabNameAll:
                        eventName = $scope.itemNameForEventConstruction + '_' + $scope.tabNameAll;
                        break;
                    case $scope.tabNameConstruction:
                        eventName = $scope.itemNameForEventConstruction + '_' + $scope.tabNameConstruction;
                        break;
                }
                break;
            case $scope.itemNameForEventAnnouncement:
                switch($scope.tab) {
                    case $scope.tabNameAll:
                        eventName = $scope.itemNameForEventAnnouncement + '_' + $scope.tabNameAll;
                        break;
                    case $scope.tabNameAnnouncement:
                        eventName = $scope.itemNameForEventAnnouncement + '_' + $scope.tabNameAnnouncement;
                        break;
                }
                break;
            case $scope.itemNameForEventProposal:
                switch($scope.tab) {
                    case $scope.tabNameAll:
                        eventName = $scope.itemNameForEventProposal + '_' + $scope.tabNameAll;
                        break;
                    case $scope.tabNameProposal:
                        eventName = $scope.itemNameForEventProposal + '_' + $scope.tabNameProposal;
                        break;
                }
                break;
        }

        if(eventName.length > 0) {
            $scope.$emit(eventName);
        }

        $scope.itemNameForEvent = '';
    }

    function groupDeletedEventEmit() {
        switch($scope.tab) {
            case $scope.tabNameAll:
                $rootScope.$emit('constructionTabReload');
                $rootScope.$emit('announcementTabReload');
                $rootScope.$emit('proposalTabReload');
                break;
            case $scope.tabNameConstruction:
            case $scope.tabNameAnnouncement:
            case $scope.tabNameProposal:
                $rootScope.$emit('allTabReload');
                break;
        }
    }

    function eventObserve() {

        // SOME ITEM CHANGED EVENTS (DELETE OF CONSTRUCTION UPDATE)
        var constructionTabAll          = $scope.itemNameForEventConstruction + '_' + $scope.tabNameAll + '_reload';
        var constructionTabConstruction = $scope.itemNameForEventConstruction + '_' + $scope.tabNameConstruction + '_reload';
        var announcementTabAll          = $scope.itemNameForEventAnnouncement + '_' + $scope.tabNameAll + '_reload';
        var announcementTabAnnouncement = $scope.itemNameForEventAnnouncement + '_' + $scope.tabNameAnnouncement + '_reload';
        var proposalTabAll              = $scope.itemNameForEventProposal + '_' + $scope.tabNameAll + '_reload';
        var proposalTabProposal         = $scope.itemNameForEventProposal + '_' + $scope.tabNameProposal + '_reload';

        $scope.$on(constructionTabAll, function(event, data) {
            if($scope.tab == 'all') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $scope.$on(constructionTabConstruction, function(event, data) {
            if($scope.tab == 'construction') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $scope.$on(announcementTabAll, function(event, data) {
            if($scope.tab == 'all') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $scope.$on(announcementTabAnnouncement, function(event, data) {
            if($scope.tab == 'announcement') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $scope.$on(proposalTabAll, function(event, data) {
            if($scope.tab == 'all') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $scope.$on(proposalTabProposal, function(event, data) {
            if($scope.tab == 'proposal') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        // GROUP DELETE EVENTS
        $rootScope.$on('constructionTabReload', function(event, data) {
            if($scope.tab == 'construction') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $rootScope.$on('announcementTabReload', function(event, data) {
            if($scope.tab == 'announcement') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $rootScope.$on('proposalTabReload', function(event, data) {
            if($scope.tab == 'proposal') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });

        $rootScope.$on('allTabReload', function(event, data) {
            if($scope.tab == 'all') {
                $scope.getList();
                $scope.pgCreatePages();
            }
        });
    }
}

})();
