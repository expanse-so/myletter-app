import React from 'react';

interface Model {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  cost_tier: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  showCostTier?: boolean;
  groupByProvider?: boolean;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled = false,
  showCostTier = false,
  groupByProvider = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (!models || models.length === 0) {
    return <div>No models available</div>;
  }
  
  const selectedModelData = models.find((model) => model.id === selectedModel);
  
  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };
  
  // Group models by provider if requested
  const groupedModels = React.useMemo(() => {
    if (!groupByProvider) return null;
    
    return models.reduce((groups, model) => {
      const provider = model.provider;
      if (!groups[provider]) {
        groups[provider] = [];
      }
      groups[provider].push(model);
      return groups;
    }, {} as Record<string, Model[]>);
  }, [models, groupByProvider]);
  
  // Format provider name to be more readable
  const formatProvider = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };
  
  return (
    <div className="model-selector">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="model-selector-button"
        disabled={disabled}
      >
        {selectedModelData ? selectedModelData.name : 'Select a model'}
      </button>
      
      {isOpen && (
        <div className="model-selector-dropdown">
          {groupByProvider ? (
            // Render models grouped by provider
            Object.entries(groupedModels || {}).map(([provider, providerModels]) => (
              <div key={provider} className="provider-group">
                <div className="provider-name">{formatProvider(provider)}</div>
                {providerModels.map((model) => (
                  <div
                    key={model.id}
                    className={`model-option ${model.id === selectedModel ? 'selected' : ''}`}
                    onClick={() => handleSelect(model.id)}
                  >
                    <span>{model.name}</span>
                    {showCostTier && <span className="cost-tier">{model.cost_tier}</span>}
                  </div>
                ))}
              </div>
            ))
          ) : (
            // Render flat list of models
            models.map((model) => (
              <div
                key={model.id}
                className={`model-option ${model.id === selectedModel ? 'selected' : ''}`}
                onClick={() => handleSelect(model.id)}
              >
                <span>{model.name}</span>
                {showCostTier && <span className="cost-tier">{model.cost_tier}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}