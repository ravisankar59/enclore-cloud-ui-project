describe('Filter: bytes', function () {
    var bytesFilter, result;

    beforeEach(function () {
        module('encore');
        inject(function ($filter) {
            bytesFilter = $filter;
        });
    });

    describe('Filter bytes with default precision 3', function () {

        it('should take 1 byte and return 1.000 bytes', function () {
            result = bytesFilter('bytes')(1);
            expect(result).to.equal('1.000 bytes');
        });
        it('should take 1000 bytes and return 1000.000 bytes', function () {
            result = bytesFilter('bytes')(1000);
            expect(result).to.equal('1000.000 bytes');
        });
        it('should take 1024 bytes and return 1.000 kB', function () {
            result = bytesFilter('bytes')(1024);
            expect(result).to.equal('1.000 kB');
        });
        it('should take 1048576 bytes and return 1.000 MB', function () {
            result = bytesFilter('bytes')(1048576);
            expect(result).to.equal('1.000 MB');
        });
        it('should take 1073741824 bytes nand return 1.000 GB', function () {
            result = bytesFilter('bytes')(1073741824);
            expect(result).to.equal('1.000 GB');
        });
        it('should take 1099511627776 bytes and return 1.000 TB', function () {
            result = bytesFilter('bytes')(1099511627776);
            expect(result).to.equal('1.000 TB');
        });
        it('should take 1125899906842624 bytes and return 1.000 PB', function () {
            result = bytesFilter('bytes')(1125899906842624);
            expect(result).to.equal('1.000 PB');
        });
    });

    describe('Filter with given precision', function () {

        it('should return with precision 2', function () {
            result = bytesFilter('bytes')(1048576, 2);
            expect(result).to.equal('1.00 MB');
        });
        it('should return with precision 3', function () {
            result = bytesFilter('bytes')(1048576, 3);
            expect(result).to.equal('1.000 MB');
        });
        it('should return with precision 4', function () {
            result = bytesFilter('bytes')(1048576, 4);
            expect(result).to.equal('1.0000 MB');
        });
        it('should return with precision 5', function () {
            result = bytesFilter('bytes')(1048576, 5);
            expect(result).to.equal('1.00000 MB');
        });
    });

    describe('Filter N/A responses', function () {
        it('should take 0 bytes and return N/A', function () {
            result = bytesFilter('bytes')(0, 2);
            expect(result).to.equal('N/A');
        });
        it('should take "@" and return N/A', function () {
            result = bytesFilter('bytes')('@', 2);
            expect(result).to.equal('N/A');
        });
        it('should take "4@" and return N/A', function () {
            result = bytesFilter('bytes')('4@', 2);
            expect(result).to.equal('N/A');
        });
        it('should take "4 @" and return N/A', function () {
            result = bytesFilter('bytes')('4 @', 2);
            expect(result).to.equal('N/A');
        });
        it('should take "TEST" and return N/A', function () {
            result = bytesFilter('bytes')('TEST', 2);
            expect(result).to.equal('N/A');
        });
        it('should take nothing and return N/A', function () {
            result = bytesFilter('bytes')();
            expect(result).to.equal('N/A');
        });
    });
});
