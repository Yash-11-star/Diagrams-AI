from typing import Optional

from .cicd_pipeline import MODULE as CICD_PIPELINE_MODULE
from .cloud_architecture import MODULE as CLOUD_ARCHITECTURE_MODULE
from .component import MODULE as COMPONENT_MODULE
from .data_flow import MODULE as DATA_FLOW_MODULE
from .deployment import MODULE as DEPLOYMENT_MODULE
from .network import MODULE as NETWORK_MODULE
from .types import DiagramPromptModule
from .use_case import MODULE as USE_CASE_MODULE
from .user_flow import MODULE as USER_FLOW_MODULE
from .user_journey import MODULE as USER_JOURNEY_MODULE

MODULES_BY_TYPE: dict[str, DiagramPromptModule] = {
    COMPONENT_MODULE.diagram_type: COMPONENT_MODULE,
    DEPLOYMENT_MODULE.diagram_type: DEPLOYMENT_MODULE,
    DATA_FLOW_MODULE.diagram_type: DATA_FLOW_MODULE,
    USE_CASE_MODULE.diagram_type: USE_CASE_MODULE,
    USER_FLOW_MODULE.diagram_type: USER_FLOW_MODULE,
    USER_JOURNEY_MODULE.diagram_type: USER_JOURNEY_MODULE,
    CLOUD_ARCHITECTURE_MODULE.diagram_type: CLOUD_ARCHITECTURE_MODULE,
    NETWORK_MODULE.diagram_type: NETWORK_MODULE,
    CICD_PIPELINE_MODULE.diagram_type: CICD_PIPELINE_MODULE,
}


def get_diagram_prompt_module(diagram_type: str) -> Optional[DiagramPromptModule]:
    return MODULES_BY_TYPE.get(diagram_type)
