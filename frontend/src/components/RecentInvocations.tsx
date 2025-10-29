type Invocation = {
  id: string
  response: string
  createdAt: string | Date
  model?: { name?: string }
  toolCalls?: { toolCallType: string; metadata: string; createdAt: string | Date }[]
}

type Props = {
  data: Invocation[] | null
}

export default function RecentInvocations({ data }: Props) {
  if (!data) {
    return <div>Loading...</div>
  }

  const items = data.map((inv) => ({
    id: inv.id,
    modelName: inv.model?.name ?? 'unknown',
    createdAt: new Date(inv.createdAt),
    response: inv.response,
    toolCalls: (inv.toolCalls ?? []).map(tc => ({
      type: tc.toolCallType,
      createdAt: new Date(tc.createdAt as any),
      metadata: tc.metadata,
    })),
  }))

  return (
    <div style={{ height: 1800, overflowY: 'auto', paddingLeft: 16 }}>
      <h2 style={{ marginTop: 0 }}>Recent Invocations</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it) => (
          <details key={it.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', cursor: 'pointer', listStyle: 'none' }}>
              <span style={{ fontWeight: 600 }}>{it.modelName}</span>
              <span style={{ color: '#6b7280', fontSize: 12 }}>{it.createdAt.toLocaleString()}</span>
            </summary>
            <div style={{ marginTop: 8 }}>
              {it.toolCalls && it.toolCalls.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Tool calls</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {it.toolCalls.map((tc, idx) => (
                      <div key={idx} style={{ background: '#f9fafb', border: '1px solid #eef2f7', borderRadius: 6, padding: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{tc.type}</span>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>{tc.createdAt.toLocaleString()}</span>
                        </div>
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                          {tc.metadata}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                {it.response}
              </pre>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}


