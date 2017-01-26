export const data = {
    'id': 'root',
    'props': {
        'label': 'All Users / Groups'
    },
    'children': [
        {
            'id': 'legal',
            'props': {
                'label': 'Legal'
            },
            'loadOnDemand': 'true'
        },
        {
            'id': 'finance',
            'props': {
                'label': 'Finance'
            },
            'children': [
                {
                    'id': 'finance.1',
                    'props': {
                        'label': 'Finance: User_1'
                    }
                },
                {
                    'id': 'finance.2',
                    'props': {
                        'label': 'Finance: User_2'
                    }
                },
                {
                    'id': 'finance.3',
                    'props': {
                        'label': 'Finance: User_3'
                    }
                }
            ]
        },
        {
            'id': 'marketing',
            'props': {
                'label': 'Marketing'
            },
            'children': [
                {
                    'id': 'digital-marketing',
                    'props': {
                        'label': 'Digital Marketing'
                    },
                    'children': [
                        {
                            'id': 'digital-marketing.1',
                            'props': {
                                'label': 'Digital Marketing: User_1'
                            }
                        },
                        {
                            'id': 'digital-marketing.2',
                            'props': {
                                'label': 'Digital Marketing: User_2'
                            }
                        },
                        {
                            'id': 'digital-marketing.3',
                            'props': {
                                'label': 'Digital Marketing: User_3'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

export const asyncData = [
    {
        'id': 'legal.1',
        'props': {
            'label': 'Legal: User_1'
        }
    },
    {
        'id': 'legal.2',
        'props': {
            'label': 'Legal: User_2'
        }
    },
    {
        'id': 'legal.3',
        'props': {
            'label': 'Legal: User_3'
        }
    }
];
