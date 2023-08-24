import { defineComponent, onMounted, ref } from 'vue';
import { match, P, Pattern } from 'ts-pattern';

type Response =
  | { status: 'idle' }
  | { status: 'loading'; startTime: string }
  | { status: 'success'; data: { id: number; name: string } }
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
        state.value = {
          status: 'success',
          data: { id: 1, name: 'Return Value Name' },
        };
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
            .with({ status: 'loading' }, (data) => (
              <p>
                Loading at <strong>{data.startTime}</strong>
              </p>
            ))
            .with(
              {
                status: 'success',
                data: { id: P.select('id'), name: P.select('name') },
              },
              ({ id, name }) => (
                <p>
                  Response with{' '}
                  <strong>
                    Id: {id}, Name: {name}
                  </strong>
                </p>
              )
            )
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
            <p>
              Loading at <strong>{state.value.startTime}</strong>
            </p>
          ) : state.value.status === 'success' ? (
            <p>
              Response with{' '}
              <strong>
                Id: {state.value.data.id}, Name: {state.value.data.name}
              </strong>
            </p>
          ) : null}
        </div>
      );
    };

    return tsPatternRender;
  },
});
