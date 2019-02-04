import { Repository } from '../../src/models/repository'
import { setupEmptyRepository } from './repositories'
import { makeCommit } from './repository-scaffolding'

/**
 * Creates a test repository to be used as the branch for testing rebase
 * behaviour with:
 *  - two commits on `master`,
 *  - two commits on `firstBranchName`, which is based on `master`
 *  - three commits on `secondBranchName`, which is also based on `master`
 */
export async function createRepository(
  firstBranchName: string,
  secondBranchName: string
): Promise<Repository> {
  const repository = await setupEmptyRepository()

  // make two commits on `master` to setup the README

  const firstCommit = {
    commitMessage: 'First!',
    entries: [
      {
        path: 'README.md',
        contents: '# HELLO WORLD! \n',
      },
    ],
  }

  await makeCommit(repository, firstCommit)

  const secondCommit = {
    commitMessage: 'Second!',
    entries: [
      {
        path: 'THING.md',
        contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
      },
      {
        path: 'OTHER.md',
        contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
      },
    ],
  }

  await makeCommit(repository, secondCommit)

  // TODO: setup the branches

  return repository
}
