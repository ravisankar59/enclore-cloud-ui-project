var changeNameModal = {

    txtLoadBalancerName: {
        get: function () {
            return $('#load_balancer_name');
        }
    },

    loadBalancerName: {
        get: function () {
            return this.txtLoadBalancerName.getAttribute('value');
        },
        set: function (value) {
            this.txtLoadBalancerName.clear();
            this.txtLoadBalancerName.sendKeys(value);
        }
    },

    changeName: {
        value: function (loadBalancerName) {
            this.loadBalancerName = loadBalancerName;
            this.submit();
        }
    },
};

module.exports = encore.rxModalAction.initialize(changeNameModal);
