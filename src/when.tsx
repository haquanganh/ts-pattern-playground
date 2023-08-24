import { defineComponent, onMounted, ref } from 'vue';
import { match, P, Pattern } from 'ts-pattern';

type Response =
  | { status: 'idle' }
  | { status: 'loading'; startTime: string }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

export default defineComponent({
  setup() {
    const state = ref<Response>({ status: 'idle' });

    const fetchData = () => {
      setTimeout(() => {
        state.value = {
          status: 'loading',
          startTime: new Date().toLocaleString(),
        };
      }, 2000);

      setTimeout(() => {
        state.value = { status: 'success', data: 'Response data' };
      }, 4000);
    };

    onMounted(() => {
      fetchData();
    });

    const tsPatternRender = () => {
      return (
        <div class="wrapper">
          {match(state.value)
            .with({ status: 'idle' }, () => <p>Idle</p>)
            .with(
              {
                status: 'loading',
                startTime: P.when((time) => time === 'at a specific of time'),
              },
              (data) => (
                <p>
                  Loading at <strong>{data.startTime}</strong>
                </p>
              )
            )
            .with({ status: 'success' }, (data) => (
              <p>
                Success with response: <strong>{data.data}</strong>
              </p>
            ))
            .otherwise(() => null)}
        </div>
      );
    };

    const render = () => {
      return (
        <div class="wrapper">
          {state.value.status === 'idle' ? (
            <p>Idle</p>
          ) : state.value.status === 'loading' ? (
            (() => {
              if (state.value.startTime === 'at a specific of time')
                return (
                  <p>
                    Loading at <strong>{state.value.startTime}</strong>
                  </p>
                );
              return null;
            })()
          ) : state.value.status === 'success' ? (
            <p>
              Success with response: <strong>{state.value.data}</strong>
            </p>
          ) : null}
        </div>
      );
    };

    return tsPatternRender;
  },
});
