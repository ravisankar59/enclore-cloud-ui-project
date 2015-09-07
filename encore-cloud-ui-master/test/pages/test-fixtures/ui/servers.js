var images = {
    firstgen: {
        linux: {
            staging: 'Ubuntu 12.04 MGC Base',
            preprod: 'Ubuntu 12.04 LTS'
        },
        windows: {
            staging: 'Windows Server 2008 R2 x64 - Mgd',
            preprod: 'Windows Server 2008 R2 x64'
        }
    },
    nextgen: {
        linux: {
            staging: 'CentOS 6 (PV)',
            preprod: 'CentOS 6.5'
        },
        windows: {
            staging: 'Windows Server 2012',
            preprod: 'Windows Server 2012'
        }
    }
};

module.exports = {

    firstgenStandard: {
        value: {
            name: 'auto-firstgenStandard',
            region: {
                type: 'FirstGen',
                label: 'DFW (Dallas)'
            },
            flavor: {
                type: 'standard',
                name: '256 server'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.firstgen.linux[ptor.params.env] || images.firstgen.linux['staging']
            },
            networks: []
        }
    },

    firstgenWindows: {
        value: {
            name: 'auto-firstgenWindows',
            region: {
                type: 'FirstGen',
                label: 'DFW (Dallas)'
            },
            flavor: {
                type: 'standard',
                name: '1GB server'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.firstgen.windows[ptor.params.env] || images.firstgen.windows['staging']
            },
            networks: []
        }
    },

    nextGenAttachVolServer: {
        value: {
            name: 'auto-nextGenAttachVolServer'
        }
    },

    nextGenDetachVolServer: {
        value: {
            name: 'auto-nextGenDetachVolServer'
        }
    },

    nextgenStandard: {
        value: {
            name: 'auto-nextgen-standard',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'standard',
                name: '512MB Standard'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.nextgen.linux[ptor.params.env] || images.nextgen.linux['staging']
            },
            networks: []
        }
    },

    nextgenPerformance1: {
        value: {
            name: 'auto-nextgenPerformance1',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'performance1',
                name: '1 GB Performance'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.nextgen.linux[ptor.params.env] || images.nextgen.linux['staging']
            },
            networks: []
        }
    },

    nextgenPerformance2: {
        value: {
            name: 'auto-nextgenPerformance2',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'performance2',
                name: '15 GB Performance'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.nextgen.linux[ptor.params.env] || images.nextgen.linux['staging']
            },
            networks: []
        }
    },

    nextgenSnapshot: {
        value: {
            name: 'auto-nextgenSnapshot',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'standard',
                name: '512MB Standard'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'saved',
                name: 'test_image'
            },
            networks: []
        }
    },

    nextgenWindows: {
        value: {
            name: 'auto-nextgenWindows',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'standard',
                name: '1GB Standard'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: images.nextgen.windows[ptor.params.env] || images.nextgen.windows['staging']
            },
            networks: []
        }
    },

    successMidwayFgServer: {
        value: {
            name: 'test',
            region: {
                type: 'FirstGen',
                label: 'DFW (Dallas)'
            },
            flavor: {
                type: 'standard',
                name: '256 server'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: 'CentOS 5 - MGC LAMP'
            },
            networks: []
        }
    },

    failMidwayFgServer: {
        value: {
            name: 'fail',
            region: {
                type: 'FirstGen',
                label: 'DFW (Dallas)'
            },
            flavor: {
                type: 'standard',
                name: '256 server'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: 'CentOS 5 - MGC LAMP'
            },
            networks: []
        }
    },

    successMidwayNgServer: {
        value: {
            name: 'test',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'standard',
                name: '512MB Standard'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: 'CentOS 5.9'
            },
            networks: []
        }
    },

    failMidwayNgServer: {
        value: {
            name: 'fail',
            region: {
                type: 'NextGen',
                label: 'ORD (Chicago)'
            },
            flavor: {
                type: 'standard',
                name: '512MB Standard'
            },
            bootSource: {
                type: 'local'
            },
            image: {
                type: 'rackspace',
                name: 'CentOS 5.9'
            },
            networks: []
        }
    }

};
