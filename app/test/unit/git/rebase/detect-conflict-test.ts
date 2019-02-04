import { IStatusResult } from '../../../../src/lib/git'

import { Repository } from '../../../../src/models/repository'
import { createRepository } from '../../../helpers/repository-builder-rebase-test'
import { IGitResult } from 'dugite'
import { rebase, abortRebase } from '../../../../src/lib/git/rebase'
import { getStatusOrThrow } from '../../../helpers/status'
import { AppFileStatusKind } from '../../../../src/models/status'

const baseBranch = 'base-branch'
const featureBranch = 'this-is-a-feature'

describe('git/rebase', () => {
  describe('detect conflicts', () => {
    let repository: Repository
    let result: IGitResult
    let status: IStatusResult

    beforeEach(async () => {
      repository = await createRepository(baseBranch, featureBranch)

      result = await rebase(repository, baseBranch, featureBranch)

      status = await getStatusOrThrow(repository)
    })

    it('returns a non-zero exit code', async () => {
      expect(result.exitCode).toBeGreaterThan(0)
    })

    it('status detects REBASE_HEAD', async () => {
      expect(status.rebaseHeadFound).toBe(true)
    })

    it('has conflicted files in working directory', async () => {
      expect(
        status.workingDirectory.files.filter(
          f => f.status.kind === AppFileStatusKind.Conflicted
        )
      ).toHaveLength(2)
    })

    it('is a detached HEAD state', async () => {
      expect(status.currentBranch).toBeUndefined()
    })
  })

  describe('abort after conflicts', () => {
    let repository: Repository
    let status: IStatusResult

    beforeEach(async () => {
      repository = await createRepository(baseBranch, featureBranch)

      await rebase(repository, baseBranch, featureBranch)

      await abortRebase(repository)

      status = await getStatusOrThrow(repository)
    })

    it('REBASE_HEAD is no longer found', async () => {
      expect(status.rebaseHeadFound).toBe(false)
    })

    it('no longer has working directory changes', async () => {
      expect(status.workingDirectory.files).toHaveLength(0)
    })

    it('returns to the feature branch', async () => {
      expect(status.currentBranch).toBe(featureBranch)
    })
  })
})
