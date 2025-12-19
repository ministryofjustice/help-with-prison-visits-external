import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
  allowlist: {
    'node_modules/@parcel/watcher@2.5.1': 'ALLOW',
    'node_modules/cypress@15.8.1': 'ALLOW',
    'node_modules/dtrace-provider@0.8.8': 'ALLOW',
    'node_modules/fsevents@2.3.3': 'ALLOW',
    'node_modules/unrs-resolver@1.11.1': 'ALLOW',
  },
})
