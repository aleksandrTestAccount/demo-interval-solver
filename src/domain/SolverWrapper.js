import SolverWorker from './solver.worker.js?worker'
import { WORKER_EVENTS } from './workerEvents.js'

/**
 * @typedef {Object} SolverCallbacks
 * @property {(msg: string) => void} [onProgress] - Invoked on each progress step
 * @property {(result: any) => void} [onSuccess] - Invoked when calculations complete successfully
 * @property {(error: any) => void} [onFailure] - Invoked on solver error or worker crash
 */
export class SolverWrapper {
  #worker = null

  /**
   * Runs calculations in a background thread
   * @param {string} code - Source code in E0 language
   * @param {SolverCallbacks} [callbacks] - Event handler callbacks
   */
  solve(code, { onProgress, onSuccess, onFailure } = {}) {
    this.terminate()

    try {
      this.#worker = new SolverWorker()

      this.#worker.onmessage = (e) => {
        const { type, payload } = e.data || {}

        if (type === WORKER_EVENTS.PROGRESS) {
          onProgress?.(payload)
          return
        }

        this.terminate()

        if (type === WORKER_EVENTS.SUCCESS) {
          onSuccess?.(payload)
        } else if (type === WORKER_EVENTS.FAILURE) {
          onFailure?.(payload)
        }
      }

      this.#worker.onerror = (err) => {
        this.terminate()
        onFailure?.(new Error(err.message || 'Worker thread crashed'))
      }

      this.#worker.postMessage({
        code,
        baseUrl: window.location.href
      })
    } catch (err) {
      this.terminate()
      onFailure?.(err)
    }
  }

  /**
   * Terminates the running worker thread
   */
  terminate() {
    if (this.#worker) {
      try {
        this.#worker.terminate()
      } catch {}
      this.#worker = null
    }
  }
}
