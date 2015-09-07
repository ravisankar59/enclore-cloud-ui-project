var pagination = function (elements) {

    _.each(elements, function (pages, ele) {

        pagination = encore.rxPaginate.initialize($(ele));

        if (pages > 1) {

            it('(paginate) should navigate to the last page', function () {
                basePage.setItemsPerPage(50);
                pagination.jumpToLowestAvailablePage();
                pagination.page.then(function (firstPage) {
                    pagination.last();
                    expect(pagination.page).to.eventually.be.above(firstPage);
                });
            });

            it('(paginate) should have the expected number of page(s): ' + pages, function () {
                expect(pagination.page).to.eventually.equal(pages);
            });

            it('(paginate) should not allow navigating `next` the last page', function () {
                expect(pagination.next).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should not allow navigating using `last` past the last page', function () {
                expect(pagination.last).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should navigate to the first page', function () {
                pagination.first();
                expect(pagination.page).to.eventually.equal(1);
            });

            it('(paginate) should not allow navigating `prev` the first page', function () {
                expect(pagination.previous).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should not allow navigating using `first` before the first page', function () {
                expect(pagination.first).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should navigate forward one page at a time', function () {
                pagination.next();
                expect(pagination.page).to.eventually.equal(2);
            });

            it('(paginate) should navigate backwards one page at a time', function () {
                pagination.previous();
                expect(pagination.page).to.eventually.equal(1);
            });
        } else {
            it('(paginate) should have the expected number of page(s): ' + pages, function () {
                basePage.setItemsPerPage(50);
                pagination.jumpToHighestAvailablePage();
                expect(pagination.page).to.eventually.equal(pages);
            });

            it('(paginate) should not allow navigating `next` the last page', function () {
                expect(pagination.next).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should not allow navigating using `last` past the last page', function () {
                expect(pagination.last).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should not allow navigating `prev` the first page', function () {
                expect(pagination.previous).to.throw(pagination.NoSuchPageException);
            });

            it('(paginate) should not allow navigating using `first` before the first page', function () {
                expect(pagination.first).to.throw(pagination.NoSuchPageException);
            });
        }

    });

};

module.exports = pagination;
