/*jshint camelcase: false*/
// camelcase needs to be ignored in this file because the API returns an object that
// has a property with an _ in it
angular.module('servers')
    .controller('ShowNextGenServerCtrl', function ($scope, $routeParams, $q,
        NextGenServers, NextGenAttachments, Status, rxPromiseNotifications, RackConnect) {

        Status.setScope($scope);

        $scope.server = {
            id: $routeParams.serverId,
            region: $routeParams.region
        };

        $scope.hasMetadata = function (server) {
            return !_.isEmpty(server.metadata);
        };

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.serverId = $routeParams.serverId;
        $scope.actionList = [
            'createImage', 'attachVolume', 'changePass', 'changeName',
            'changeNickname', 'rebootServer', 'rebuildServer', 'resizeServer',
            'verifyResize', 'revertResize', 'rescueServer', 'unrescueServer',
            'deleteServer', 'openConsole', 'migrateServer', 'suspendServer', 'unsuspendServer'
        ];
        $scope.relatedDataTemplates = [
            'views/servers/templates/rd-ip-addresses.html',
            'views/servers/templates/rd-managed-passwords.html',
            'views/servers/templates/rd-metadata.html',
            'views/servers/templates/rd-attached-volumes.html',
            'views/servers/templates/rd-ssh-keys.html'
        ];

        var svcParams = {
            user: $scope.user,
            id: $scope.serverId,
            region: $routeParams.region
        };

        var loadFlavorDetails = function (flavorId) {
            if (!($scope.server.flavor instanceof NextGenServers)) {
                $scope.server.flavor = new NextGenServers($scope.server.flavor);
            }

            var svcFlavorParams = {
                user: $scope.user,
                region: $routeParams.region,
                id: flavorId
            };

            rxPromiseNotifications.add($scope.server.flavor.$getFlavor(svcFlavorParams), {
                error: 'Error loading server flavor: {{ data.error.message || statusText }}'
            });

        };

        $scope.loadFlavorDetails = loadFlavorDetails;

        var loadRackConnect = function (serverId, accountNumber, region) {
            var rackConnect = RackConnect.getIpAddresses({
                id: serverId,
                accountNumber: accountNumber,
                region: region
            });

            return rackConnect.$promise.then(function (data) {
                _.forEach(data.addresses, function (address) {
                    $scope.server.addresses.push(address);
                });
            });
        };

        $scope.loadServerDetails = function () {

            Status.setLoading('Loading Server Details');

            var serverDetailSuccess = function (data) {
                Status.complete();
                $scope.server = data.server;
                $scope.server.gen = 'Next';
                if (_.isEmpty($scope.server.metadata)){
                    $scope.server.metadata = null;
                }

                loadFlavorDetails($scope.server.flavor.id);
                loadRackConnect($scope.serverId, $scope.accountNumber, $routeParams.region);
            };

            var serverDetailFailure = function (error) {
                Status.setError('Error loading server details: ${message}', error);
            };

            var serverAttachmentSuccess = function (data) {
                /* jshint camelcase:false */
                $scope.volumeAttachments = data['volume_attachments'];
            };

            NextGenServers.get(svcParams, serverDetailSuccess, serverDetailFailure);
            NextGenAttachments.get(svcParams, serverAttachmentSuccess);
        };

        $scope.loadServerDetails();

    });
