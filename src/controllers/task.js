import * as services from "../services/task";

export const getTaskTypes = async (req, res) => {
    try {
        const response = await services.getTaskTypesService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at campaign controller: " + error,
        });
    }
};
export const assignTask = async (req, res) => {
    const volunteerId = req.query.id;
    const organizationId = req.user.id;
    const { taskTypeId } = req.body;

    try {
        if (!volunteerId || !organizationId || !taskTypeId) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs: volunteerId, organizationId, or taskTypeId",
            });
        }

        const response = await services.assignTaskService(
            volunteerId,
            taskTypeId
        );

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at assignTask controller: " + error.message,
        });
    }
};
