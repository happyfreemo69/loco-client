# Dummy js client for loco

Did not found it in the official [repo](https://github.com/loco)

# Translate

    require('./loco').getTranslation({loco_apiKey: xx}, id, locale)

ex:

    require('./loco').getTranslation({loco_apiKey: 'fzef'}, SOME_TRANSLATION_ID, 'fr')

# List locales

    require('./loco').getLocales({loco_apiKey: xx})

# Get export

    require('./loco').getExport({loco_apiKey: 'fzef'}, 'fr')